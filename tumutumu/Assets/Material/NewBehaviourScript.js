#pragma strict
 
public
var ballPrefab: GameObject; //ボールのプレハブ
public
var ballSprites: Sprite[]; //ボールの画像のリスト
 
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