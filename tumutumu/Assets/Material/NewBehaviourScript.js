#pragma strict
 
public
var ballPrefab: GameObject; //ボールのプレハブ
public
var ballSprites: Sprite[]; //ボールの画像のリスト

private
var firstBall: GameObject;
private
var removableBallList: Array;
private
var lastBall: GameObject;
private
var currentName: String;

public
var score: GameObject; //スコア表示
 
function Start() {
  DropBall(55); //ボールを指定した数上から降らせる
}

private
function DropBall(count: int) {
  for (var i = 0; i < count; i++) {
    var ball = Instantiate(ballPrefab); //ボールのプレハブを読み込み
    ball.transform.position.x = Random.Range(-2.0, 2.0); //ボールのｘ座標をランダムに設定
    ball.transform.position.y = 7; //ボールのｙ座標を調整
    ball.transform.eulerAngles.z = Random.Range(-40, 40); //ボールの角度をランダムに設定
    var spriteId: int = Random.Range(0, 5); //ボールの画像のid(ボールの色)をランダムに設定
    ball.name = "Ball" + spriteId; //ボールの名前を画像のidに合わせ変更
    var ballTexture = ball.GetComponent(SpriteRenderer); //ボールの画像を管理している要素を取得
    ballTexture.sprite = ballSprites[spriteId]; //ボールの画像をidに合わせて変更
    yield WaitForSeconds(0.05); //次のボールを生成するまで一定時間待つ
  }
}

function Update() {
    if (Input.GetMouseButton(0) && firstBall == null) {
      OnDragStart();
    } else if (Input.GetMouseButtonUp(0)) {
      OnDragEnd();
    } else if (firstBall != null) {
      OnDragging();
    }
}
 
private
function OnDragStart() {
  var col = GetCurrentHitCollider();
  if (col != null) {
    var colObj = col.gameObject;
    if (colObj.name.IndexOf("Ball") != -1) {
      removableBallList = new Array();
      firstBall = colObj;
      currentName = colObj.name;
      PushToList(colObj);
    }
  }
}
 
private
function OnDragEnd() {
  if (firstBall != null) {
    var length = removableBallList.length;
    if (length >= 3) {
      for (var i = 0; i < length; i++) {
        Destroy(removableBallList[i]);
      }
      DropBall(length);
    } else {
      for (var j = 0; j < length; j++) {
        var listedBall: GameObject = removableBallList[j];
 
        //ここに追加
        ChangeColor(listedBall, 1.0);
 
 
        listedBall.name = listedBall.name.Substring(1, 5);
      }
    }
    firstBall = null;
  }
}
 
private
function OnDragging() {
  var col = GetCurrentHitCollider();
  if (col != null) {
    //なにかをドラッグしているとき
    var colObj = col.gameObject;
    if (colObj.name == currentName) {
      //現在リストに追加している色と同じ色のボールのとき
      if (lastBall != colObj) {
        //直前にリストにいれたのと異なるボールのとき
        var dist = Vector2.Distance(lastBall.transform.position, colObj.transform.position); //直前のボールと現在のボールの距離を計算
        if (dist <= 1.5) {
          //ボール間の距離が一定値以下のとき
          PushToList(colObj); //消去するリストにボールを追加
        }
      }
    }
  }
}
 
function PushToList(obj: GameObject) {
  lastBall = obj;

  ChangeColor(obj, 0.5);

  removableBallList.push(obj);
  obj.name = "_" + obj.name;
}
 
function GetCurrentHitCollider() {
  var hit: RaycastHit2D = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.mousePosition), Vector2.zero);
  return hit.collider;
}

private
function ChangeColor(obj: GameObject, transparency: float) {
  var ballTexture = obj.GetComponent(SpriteRenderer); //ボールの画像を管理している要素を取得
  ballTexture.color.a = transparency; //透明度を設定
}