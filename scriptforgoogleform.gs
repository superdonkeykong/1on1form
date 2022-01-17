
////

////
// 【スクリプトエディタ(Apps Script)基本設定】
// 1.上記4.でスクリプトエディタを開くとすでに「コード.gs」というファイルがあります。
// 2.そこにこのファイルをすべてコピペしてください。もともとあるfunction~は全て消した上でコピペしてください。
// 3.一旦保存してください。このあとコードの一部を書き換えますが、全てこのスクリプトエディタで行ってください。
// 4.スクリプトエディタの左側、時計のアイコンをクリックしてください。「トリガー」が開きます。
// 5.右下の「トリガーを追加」をクリックしてください。
// 6.「イベントの種類」で「フォーム送信時」を選択してください。トリガーを保存してください。
////

////



// Aで作成したシートのURL「https://docs.google.com/spreadsheets/d/xxx/edit」のxxxを以下のxxxに入れてください

var spreadSheetID = '1RohOmX8knWlWbkztOm89lJcWM5_tV-0OthMdm9bFIAU';

////上記設定が完了したら、スクリプトエディタで「実行」をクリックしてください。質問に選択肢が追加されているはずです。
////基本設定は以上です。

// ######1st##############################################################################
// 回答のシート名
var answerSheetName = 'フォームの回答 1';


// 候補日と定員を書くシート名
var sheetName = "定員";


function updateForm(){
  // 定員のある項目の名前

  ////
  // 【フォームを更新する関数】
  ////
  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();

  // FormApp.getActiveForm()


  for (var il = 0; il < items.length; il++) {

    var questionName = items[il].getTitle();
    ////
    // 【スプレッドシートの情報を取得】
    // 候補と定員を取得し、定員に満たない候補のみを取得します
    ////
    if (questionName === "会社名"){
      break;
    }

     
   // スプレッドシートをIDで取得
    var sheets = SpreadsheetApp.openById(spreadSheetID);

    // 候補と回答のシートを取得
    var sheet = sheets.getSheetByName(sheetName);
    var answerSheet = sheets.getSheetByName(answerSheetName);

    // 候補のシートのA行の2行目から下の値を配列で取得する
    var sheetLastRow = sheet.getLastRow();
    if (sheetLastRow > 1) {
      // 候補と定員を取得
      var candidate = sheet.getRange(2, 1, sheetLastRow - 1, 2).getValues();
    } else {

    }

    // 回答のシートの2行目から下の値を配列で取得する
    var answerSheetLastRow = answerSheet.getLastRow();
    if (answerSheetLastRow > 1) {
      var questionNames = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
      var colCount = questionNames[0].indexOf(questionName);    
      // 必要な部分だけ取得
      var answerData = answerSheet.getRange(2, colCount + 1, answerSheetLastRow - 1).getValues();    
    }


    ////
    // 【Googleフォームの選択肢の上書き】
    //// 





    // 選択肢の作成、更新
    items.forEach(function(item){
      // 質問項目がquestionNameの項目を探す
      if(item.getTitle() === questionName){
        var listItemQuestion = item.asListItem();
        // 選択肢を入れる配列
        var choices = [];

        // 候補日を一つ一つ見ていく
        // nameAndCapacity[0]がクライアント、nameAndCapacity[1]がその定員
        candidate.forEach(function(nameAndCapacity){        
          if(nameAndCapacity[0] != ""){
            // 定員無制限かどうか。また、回答が一件もない場合もこっち
            if (answerData == null || nameAndCapacity[1] == 0 || nameAndCapacity[1] == ""){
              choices.push(listItemQuestion.createChoice(nameAndCapacity[0]));
            } else {
              // 定員がある場合は定員以上になっていないか確認
              var counter = 0;
              // 何人分キャパが埋まっているかカウント
              for(var i = 0; i < answerData.length; i++){
                if (nameAndCapacity[0] == answerData[i]){
                  counter++;
                }
              }
              // まだキャパがあれば選択肢に追加
              if (counter < nameAndCapacity[1]){
                choices.push(listItemQuestion.createChoice(nameAndCapacity[0]));
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


  }

}









