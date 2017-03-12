using UnityEngine;
using System.Collections;

public class ballscript : MonoBehaviour {

	public GameObject ballPrefab;
	public Sprite[] ballSprites;

	void Start () {
		StartCoroutine(DropBall(50));
	}

	IEnumerator DropBall(int count) {
		for (int i = 0; i < count; i++) {
			Vector2 pos = new Vector2(Random.Range(-2.0f, 2.0f), 7f);
			GameObject ball = Instantiate(ballPrefab, pos, Quaternion.AngleAxis(Random.Range(-40, 40), Vector3.forward)) as GameObject;
			int spriteId = Random.Range(0, 5);
			ball.name = "Piyo" + spriteId;
			SpriteRenderer spriteObj = ball.GetComponent<SpriteRenderer>();
			spriteObj.sprite = ballSprites[spriteId];
			yield return new WaitForSeconds(0.05f);
		}
	}
}