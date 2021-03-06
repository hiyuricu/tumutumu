﻿#pragma strict

import UnityEngine.UI;

public
var ballPrefab: GameObject;
public
var ballSprites: Sprite[];

private
var firstBall: GameObject;
private
var removableBallList: Array;
private
var lastBall: GameObject;
private
var currentName: String;

private
var isPlaying = false;

public
var timer: GameObject;
private
var timerText:Text;
private
var timeLimit = 90;
private
var countTime = 0;

public
var score: GameObject;
private
var scoreText: Text;
private
var currentScore = 0;

function Start() {
  timerText = timer.GetComponent(Text);
  scoreText = score.GetComponent(Text);
  CountDown();
  DropBall(55);
}

private
function CountDown() {
  var count = countTime;
  while (count > 0) {
    timerText.text = count.ToString();
    yield WaitForSeconds(1);
    count -= 1;
  }
  timerText.text = "90";
  isPlaying = true;
  yield WaitForSeconds(1);
  StartTimer();
}

private
function StartTimer() {
  var count = timeLimit;
  while (count > 0) {
    timerText.text = count.ToString();
    yield WaitForSeconds(1);
    count -= 1;
  }
  timerText.text = "終";
  OnDragEnd();
  isPlaying = false;
}

private
function DropBall(count: int) {
  for (var i = 0; i < count; i++) {
    var ball = Instantiate(ballPrefab);
    ball.transform.position.x = Random.Range(-2.0, 2.0);
    ball.transform.position.y = 7;
    ball.transform.eulerAngles.z = Random.Range(-40, 40);
    var spriteId: int = Random.Range(0, 5);
    ball.name = "Ball" + spriteId;
    var ballTexture = ball.GetComponent(SpriteRenderer);
    ballTexture.sprite = ballSprites[spriteId];
    yield WaitForSeconds(0.05);
  }
}

function Update(){
  if(isPlaying){
   if (Input.GetMouseButton(0) && firstBall == null) {
      OnDragStart();
    } else if (Input.GetMouseButtonUp(0)) {
      OnDragEnd();
    } else if (firstBall != null) {
      OnDragging();
    }
  }
  scoreText.text = "" + currentScore;
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

      currentScore += 50 * length * (length + 1) - 300 + 50 * length;
      DropBall(length);
    } else {
      for (var j = 0; j < length; j++) {
        var listedBall: GameObject = removableBallList[j];
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
    var colObj = col.gameObject;
    if (colObj.name == currentName) {
      if (lastBall != colObj) {
        var dist = Vector2.Distance(lastBall.transform.position, colObj.transform.position);
        if (dist <= 1.5) {
          PushToList(colObj);
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
  var ballTexture = obj.GetComponent(SpriteRenderer);
  ballTexture.color.a = transparency;
}
