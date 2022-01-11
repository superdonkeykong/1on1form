////以下簡単に流れを記載していますが、別紙のマニュアルを参照してください。

////
// 【google form基本設定】
// 1.google formを作成してください。
// 2.質問を作成してください。質問タイトルは「round1」から「round9」までの9つです。
// *(この設定はデフォルトです。9回戦行われることを想定しています。これより回数が増減する場合は別途マニュアルを参照してください。)
// 3.必ずすべての質問をプルダウン方式にしてください。
// 4.google form編集画面の右上「⋮」からスクリプトエディタをひらいてください。
// *(この設定はデフォルトです。9回戦行われることを想定しています。これより回数が増減する場合は別途マニュアルを参照してください。)
////

////
// 【スクリプトエディタ(Apps Script)基本設定】
// 1.上記4.でスクリプトエディタを開くとすでに「コード.gs」というファイルがあります。
// 2.そこにこのファイルをすべてコピペしてください。もともとあるfunction~は全て消した上でコピペしてください。
// 3.一旦保存してください。このあとコードの一部を書き換えますが、全てこのスクリプトエディタで行ってください。
// 4.スクリプトエディタの左側、時計のアイコンをクリックしてください。「トリガー」が開きます。
// 5.右下の「トリガーを追加」をクリックしてください。
// 6.「イベントの種類」で「フォーム送信時」を選択してください。
////

////
// 【google spreadsheet基本設定】
// 1.google formの「回答」からスプレッドシートを作成してください。・・・A
// 2.シートを追加してください。9回戦の場合は9枚追加してください。名前は「round1」~「round9」です。
// 3.「round1」~「round9」の内容は別途サンプルシートを作成しているのでそれを参照してください。


// Aで作成したシートのURL「https://docs.google.com/spreadsheets/d/xxx/edit」のxxxを以下のxxxに入れてください

var spreadSheetID = 'xxx';

////上記設定が完了したら、スクリプトエディタで「実行」をクリックしてください。質問に選択肢が追加されているはずです。
////基本設定は以上です。

// ######1st##############################################################################
// 候補日と定員を書くシート名
var sheetName1st = 'round1';

// 回答のシート名
var answerSheetName = 'フォームの回答 1';

// 定員のある項目の名前
var questionName1st = 'round1';

////
// 【フォームを更新する関数】
////
function updateForm(){
  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得
  var sheets = SpreadsheetApp.openById(spreadSheetID);

  // 候補と回答のシートを取得
  var sheet = sheets.getSheetByName(sheetName1st);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate = sheet.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount = questionNames[0].indexOf(questionName1st);    
    // 必要な部分だけ取得
    var answerData = answerSheet.getRange(2, colCount + 1, answerSheetLastRow - 1).getValues();    
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  //// 

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();

  // 選択肢の作成、更新
  items.forEach(function(item){
    // 質問項目がquestionNameの項目を探す
    if(item.getTitle() === questionName1st){
      var listItemQuestion = item.asListItem();
      // 選択肢を入れる配列
      var choices = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]がクライアント、nameAndCapacity[1]がその定員
      candidate.forEach(function(nameAndCapacity1st){        
        if(nameAndCapacity1st[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData == null || nameAndCapacity1st[1] == 0 || nameAndCapacity1st[1] == ""){
            choices.push(listItemQuestion.createChoice(nameAndCapacity1st[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData.length; i++){
              if (nameAndCapacity1st[0] == answerData[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity1st[1]){
              choices.push(listItemQuestion.createChoice(nameAndCapacity1st[0]));
            }
          }
        }
      });

      if (choices.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion.setChoices(choices);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);        
      }
      return;
    }
  });


 // 2nd##############################################################################

 // 候補日と定員を書くシート名
 var sheetName2nd = 'round2';
 
  // 定員のある項目の名前
 var questionName2nd = 'round2';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////


  // 候補と回答のシートを取得
  var sheet2nd = sheets.getSheetByName(sheetName2nd);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet2nd.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate2nd = sheet2nd.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames2nd = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount2nd = questionNames2nd[0].indexOf(questionName2nd);
    // 必要な部分だけ取得
    var answerData2nd = answerSheet.getRange(2, colCount2nd + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item2nd){
    // 質問項目がquestionNameの項目を探す
    if(item2nd.getTitle() === questionName2nd){
      var listItemQuestion2nd = item2nd.asListItem();
      // 選択肢を入れる配列
      var choices2nd = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate2nd.forEach(function(nameAndCapacity2nd){
        if(nameAndCapacity2nd[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData2nd == null || nameAndCapacity2nd[1] == 0 || nameAndCapacity2nd[1] == ""){
            choices2nd.push(listItemQuestion2nd.createChoice(nameAndCapacity2nd[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData2nd.length; i++){
              if (nameAndCapacity2nd[0] == answerData2nd[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity2nd[1]){
              choices2nd.push(listItemQuestion2nd.createChoice(nameAndCapacity2nd[0]));
            }
          }
        }
      });

      if (choices2nd.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion2nd.setChoices(choices2nd);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });
 // 3rd################################################################################

 // 候補日と定員を書くシート名
 var sheetName3rd = 'round3';
  // 定員のある項目の名前
 var questionName3rd = 'round3';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得
 

  // 候補と回答のシートを取得
  var sheet3rd = sheets.getSheetByName(sheetName3rd);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet3rd.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate3rd = sheet3rd.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames3rd = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount3rd = questionNames3rd[0].indexOf(questionName3rd);
    // 必要な部分だけ取得
    var answerData3rd = answerSheet.getRange(2, colCount3rd + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item3rd){
    // 質問項目がquestionNameの項目を探す
    if(item3rd.getTitle() === questionName3rd){
      var listItemQuestion3rd = item3rd.asListItem();
      // 選択肢を入れる配列
      var choices3rd = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate3rd.forEach(function(nameAndCapacity3rd){
        if(nameAndCapacity3rd[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData3rd == null || nameAndCapacity3rd[1] == 0 || nameAndCapacity3rd[1] == ""){
            choices3rd.push(listItemQuestion3rd.createChoice(nameAndCapacity3rd[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData3rd.length; i++){
              if (nameAndCapacity3rd[0] == answerData3rd[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity3rd[1]){
              choices3rd.push(listItemQuestion3rd.createChoice(nameAndCapacity3rd[0]));
            }
          }
        }
      });

      if (choices3rd.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion3rd.setChoices(choices3rd);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 4th################################################################################

 // 候補日と定員を書くシート名
 var sheetName4th = 'round4';
  // 定員のある項目の名前
 var questionName4th = 'round4';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet4th = sheets.getSheetByName(sheetName4th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet4th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate4th = sheet4th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames4th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount4th = questionNames4th[0].indexOf(questionName4th);
    // 必要な部分だけ取得
    var answerData4th = answerSheet.getRange(2, colCount4th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item4th){
    // 質問項目がquestionNameの項目を探す
    if(item4th.getTitle() === questionName4th){
      var listItemQuestion4th = item4th.asListItem();
      // 選択肢を入れる配列
      var choices4th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate4th.forEach(function(nameAndCapacity4th){
        if(nameAndCapacity4th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData4th == null || nameAndCapacity4th[1] == 0 || nameAndCapacity4th[1] == ""){
            choices4th.push(listItemQuestion4th.createChoice(nameAndCapacity4th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData4th.length; i++){
              if (nameAndCapacity4th[0] == answerData4th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity4th[1]){
              choices4th.push(listItemQuestion4th.createChoice(nameAndCapacity4th[0]));
            }
          }
        }
      });

      if (choices4th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion4th.setChoices(choices4th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 5th################################################################################

 // 候補日と定員を書くシート名
 var sheetName5th = 'round5';
  // 定員のある項目の名前
 var questionName5th = 'round5';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet5th = sheets.getSheetByName(sheetName5th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet5th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate5th = sheet5th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames5th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount5th = questionNames5th[0].indexOf(questionName5th);
    // 必要な部分だけ取得
    var answerData5th = answerSheet.getRange(2, colCount5th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item5th){
    // 質問項目がquestionNameの項目を探す
    if(item5th.getTitle() === questionName5th){
      var listItemQuestion5th = item5th.asListItem();
      // 選択肢を入れる配列
      var choices5th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate5th.forEach(function(nameAndCapacity5th){
        if(nameAndCapacity5th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData5th == null || nameAndCapacity5th[1] == 0 || nameAndCapacity5th[1] == ""){
            choices5th.push(listItemQuestion5th.createChoice(nameAndCapacity5th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData5th.length; i++){
              if (nameAndCapacity5th[0] == answerData5th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity5th[1]){
              choices5th.push(listItemQuestion5th.createChoice(nameAndCapacity5th[0]));
            }
          }
        }
      });

      if (choices5th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion5th.setChoices(choices5th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 6th################################################################################

 // 候補日と定員を書くシート名
 var sheetName6th = 'round6';
  // 定員のある項目の名前
 var questionName6th = 'round6';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet6th = sheets.getSheetByName(sheetName6th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet6th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate6th = sheet6th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames6th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount6th = questionNames6th[0].indexOf(questionName6th);
    // 必要な部分だけ取得
    var answerData6th = answerSheet.getRange(2, colCount6th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item6th){
    // 質問項目がquestionNameの項目を探す
    if(item6th.getTitle() === questionName6th){
      var listItemQuestion6th = item6th.asListItem();
      // 選択肢を入れる配列
      var choices6th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate6th.forEach(function(nameAndCapacity6th){
        if(nameAndCapacity6th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData6th == null || nameAndCapacity6th[1] == 0 || nameAndCapacity6th[1] == ""){
            choices6th.push(listItemQuestion6th.createChoice(nameAndCapacity6th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData6th.length; i++){
              if (nameAndCapacity6th[0] == answerData6th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity6th[1]){
              choices6th.push(listItemQuestion6th.createChoice(nameAndCapacity6th[0]));
            }
          }
        }
      });

      if (choices6th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion6th.setChoices(choices6th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 7th################################################################################

 // 候補日と定員を書くシート名
 var sheetName7th = 'round7';
  // 定員のある項目の名前
 var questionName7th = 'round7';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得
 

  // 候補と回答のシートを取得
  var sheet7th = sheets.getSheetByName(sheetName7th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet7th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate7th = sheet7th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames7th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount7th = questionNames7th[0].indexOf(questionName7th);
    // 必要な部分だけ取得
    var answerData7th = answerSheet.getRange(2, colCount7th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item7th){
    // 質問項目がquestionNameの項目を探す
    if(item7th.getTitle() === questionName7th){
      var listItemQuestion7th = item7th.asListItem();
      // 選択肢を入れる配列
      var choices7th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate7th.forEach(function(nameAndCapacity7th){
        if(nameAndCapacity7th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData7th == null || nameAndCapacity7th[1] == 0 || nameAndCapacity7th[1] == ""){
            choices7th.push(listItemQuestion7th.createChoice(nameAndCapacity7th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData7th.length; i++){
              if (nameAndCapacity7th[0] == answerData7th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity7th[1]){
              choices7th.push(listItemQuestion7th.createChoice(nameAndCapacity7th[0]));
            }
          }
        }
      });

      if (choices7th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion7th.setChoices(choices7th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 8th################################################################################

 // 候補日と定員を書くシート名
 var sheetName8th = 'round8';
  // 定員のある項目の名前
 var questionName8th = 'round8';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet8th = sheets.getSheetByName(sheetName8th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet8th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate8th = sheet8th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames8th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount8th = questionNames8th[0].indexOf(questionName8th);
    // 必要な部分だけ取得
    var answerData8th = answerSheet.getRange(2, colCount8th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item8th){
    // 質問項目がquestionNameの項目を探す
    if(item8th.getTitle() === questionName8th){
      var listItemQuestion8th = item8th.asListItem();
      // 選択肢を入れる配列
      var choices8th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate8th.forEach(function(nameAndCapacity8th){
        if(nameAndCapacity8th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData8th == null || nameAndCapacity8th[1] == 0 || nameAndCapacity8th[1] == ""){
            choices8th.push(listItemQuestion8th.createChoice(nameAndCapacity8th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData8th.length; i++){
              if (nameAndCapacity8th[0] == answerData8th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity8th[1]){
              choices8th.push(listItemQuestion8th.createChoice(nameAndCapacity8th[0]));
            }
          }
        }
      });

      if (choices8th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion8th.setChoices(choices8th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });

 // 9th################################################################################

 // 候補日と定員を書くシート名
 var sheetName9th = 'round9';
  // 定員のある項目の名前
 var questionName9th = 'round9';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet9th = sheets.getSheetByName(sheetName9th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet9th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate9th = sheet9th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames9th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount9th = questionNames9th[0].indexOf(questionName9th);
    // 必要な部分だけ取得
    var answerData9th = answerSheet.getRange(2, colCount9th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item9th){
    // 質問項目がquestionNameの項目を探す
    if(item9th.getTitle() === questionName9th){
      var listItemQuestion9th = item9th.asListItem();
      // 選択肢を入れる配列
      var choices9th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate9th.forEach(function(nameAndCapacity9th){
        if(nameAndCapacity9th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData9th == null || nameAndCapacity9th[1] == 0 || nameAndCapacity9th[1] == ""){
            choices9th.push(listItemQuestion9th.createChoice(nameAndCapacity9th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData9th.length; i++){
              if (nameAndCapacity9th[0] == answerData9th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity9th[1]){
              choices9th.push(listItemQuestion9th.createChoice(nameAndCapacity9th[0]));
            }
          }
        }
      });

      if (choices9th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion9th.setChoices(choices9th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });
}



