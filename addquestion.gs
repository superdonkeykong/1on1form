 // add################################################################################

 // 候補日と定員を書くシート名
 var sheetName10th = '[スプシに追加した新しいシート名]';
  // 定員のある項目の名前
 var questionName10th = '[フォームに追加した新しい質問名]';



  ////
  // 【スプレッドシートの情報を取得】
  // 候補と定員を取得し、定員に満たない候補のみを取得します
  ////

  // スプレッドシートをIDで取得


  // 候補と回答のシートを取得
  var sheet10th = sheets.getSheetByName(sheetName10th);
  var answerSheet = sheets.getSheetByName(answerSheetName);

  // 候補のシートのA行の2行目から下の値を配列で取得する
  var sheetLastRow = sheet10th.getLastRow();
  if (sheetLastRow > 1) {
    // 候補と定員を取得
    var candidate10th = sheet10th.getRange(2, 1, sheetLastRow - 1, 2).getValues();
  } else {
    return;
  }

  // 回答のシートの2行目から下の値を配列で取得する
  var answerSheetLastRow = answerSheet.getLastRow();
  if (answerSheetLastRow > 1) {
    var questionNames10th = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();
    var colCount10th = questionNames10th[0].indexOf(questionName10th);
    // 必要な部分だけ取得
    var answerData10th = answerSheet.getRange(2, colCount10th + 1, answerSheetLastRow - 1).getValues();
  }

  ////
  // 【Googleフォームの選択肢の上書き】
  ////

  // フォームの取得
  var form = FormApp.getActiveForm();

  // 質問項目をすべて取得
  var items = form.getItems();
 

  // 選択肢の作成、更新
  items.forEach(function(item10th){
    // 質問項目がquestionNameの項目を探す
    if(item10th.getTitle() === questionName10th){
      var listItemQuestion10th = item10th.asListItem();
      // 選択肢を入れる配列
      var choices10th = [];

      // 候補日を一つ一つ見ていく
      // nameAndCapacity[0]が候補日、nameAndCapacity[1]がその定員
      candidate10th.forEach(function(nameAndCapacity10th){
        if(nameAndCapacity10th[0] != ""){
          // 定員無制限かどうか。また、回答が一件もない場合もこっち
          if (answerData10th == null || nameAndCapacity10th[1] == 0 || nameAndCapacity10th[1] == ""){
            choices10th.push(listItemQuestion10th.createChoice(nameAndCapacity10th[0]));
          } else {
            // 定員がある場合は定員以上になっていないか確認
            var counter = 0;
            // 何人分キャパが埋まっているかカウント
            for(var i = 0; i < answerData10th.length; i++){
              if (nameAndCapacity10th[0] == answerData10th[i]){
                counter++;
              }
            }
            // まだキャパがあれば選択肢に追加
            if (counter < nameAndCapacity10th[1]){
              choices10th.push(listItemQuestion10th.createChoice(nameAndCapacity10th[0]));
            }
          }
        }
      });

      if (choices10th.length > 0) {
        // フォームの回答を受け付ける
        form.setAcceptingResponses(true);
        // 選択肢を上書き
        listItemQuestion10th.setChoices(choices10th);
      } else {
        // 満員につき、回答受付終了
        form.setAcceptingResponses(false);
      }
      return;
    }
  });
