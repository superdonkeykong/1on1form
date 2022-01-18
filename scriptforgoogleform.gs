


// シートのURL「https://docs.google.com/spreadsheets/d/xxx/edit」のxxxを以下のxxxに入れてください

var spreadSheetID = 'xxx';

////上記設定が完了したら、スクリプトエディタで「実行」をクリックしてください。質問に選択肢が追加されているはずです。
////基本設定は以上です。

// ##################################################################################
// 回答のシート名
var answerSheetName = 'フォームの回答 1';


// 候補日と定員を書くシート名
var sheetName = "クライアント";



// 定員のある項目の名前

////
// 【フォームを更新する関数】
////
// フォームの取得
var form = FormApp.getActiveForm();

// 質問項目をすべて取得
var items = form.getItems();

// FormApp.getActiveForm()
// スプレッドシートをIDで取得
var sheets = SpreadsheetApp.openById(spreadSheetID);

// 候補と回答のシートを取得
var sheet = sheets.getSheetByName(sheetName);
var answerSheet = sheets.getSheetByName(answerSheetName);

// 候補のシートのA行の2行目から下の値を配列で取得する
var sheetLastRow = sheet.getLastRow();
if (sheetLastRow > 1) {
  // 候補と定員を取得
  var candidate = sheet.getRange(2, 1, sheetLastRow - 1).getValues();
} else {

}

var answerSheetLastRow = answerSheet.getLastRow();

if (answerSheetLastRow > 1) {
  var answerData = answerSheet.getRange(2, 2, answerSheetLastRow - 1, answerSheet.getLastColumn() - 2).getValues();  
}

function convertTwoDimensionToOneDimension(twoDimensionalArray, targetIndex) {
  oneDimensionalArray = []
  twoDimensionalArray.forEach(function(value) {
    oneDimensionalArray.push(value[targetIndex]);
  });
  return oneDimensionalArray;
}

//var questionNames = answerSheet.getRange(1, 1, 1, answerSheet.getLastColumn()).getValues();

function updateForm(){
  for (var il = 0; il < items.length; il++) {

    var questionName = items[il].getTitle();
    //var colCount = questionNames[0].indexOf(questionName);

    if (questionName === "会社名"){
      break;
    }

    if (answerSheetLastRow > 1) {
      var flatanswerData = convertTwoDimensionToOneDimension(answerData,il)
    }

    items.forEach(function(item){
      // 質問項目がquestionNameの項目を探す
      if(item.getTitle() === questionName){
        var listItemQuestion = item.asListItem();
        // 選択肢を入れる配列
        var choices = [];

        candidate.forEach(function(nameAndCapacity){        
          if(nameAndCapacity[0] != ""){
            
            if (flatanswerData == null){
              choices.push(listItemQuestion.createChoice(nameAndCapacity[0]));
            } else {
              
              var counter = 0;
              
              for(var i = 0; i < flatanswerData.length; i++){
                if (nameAndCapacity[0] == flatanswerData[i]){
                  counter++;
                }
              }
              // 選択肢に追加
              if (counter < 1){
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
