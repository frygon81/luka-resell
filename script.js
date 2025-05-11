
async function analyze() {
  const sku = document.getElementById("skuInput").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (!sku) {
    resultBox.innerText = "SKU를 입력해주세요.";
    return;
  }

  const url = `${API_URL}?sku=eq.${sku}`;
  const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`
  };

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0 || !data[0]) {
      resultBox.innerText = `[${sku}]
❌ 데이터가 없습니다.`;
      return;
    }

    const item = data[0];

    if (
      item.price === undefined ||
      item.fee === undefined ||
      item.shipping === undefined ||
      item.monthly_sales === undefined
    ) {
      resultBox.innerText = `[${sku}]
❌ 항목 데이터가 누락되어 있습니다.`;
      return;
    }

    const netProfit = item.price - item.fee - item.shipping;

    let recommend = "❌ 제외";
    if (netProfit > 20000 && item.monthly_sales > 15) recommend = "✔ 추천";
    else if (netProfit > 5000) recommend = "⚠ 테스트";

    resultBox.innerText = `
[SKU]: ${sku}
[시세]: ${item.price.toLocaleString()}원
[수수료]: ${item.fee.toLocaleString()}원
[배송비]: ${item.shipping.toLocaleString()}원
[월 판매량]: ${item.monthly_sales}건
[순이익]: ${netProfit.toLocaleString()}원
[추천]: ${recommend}
`;
  } catch (error) {
    resultBox.innerText = "❌ 오류 발생: " + error.message;
  }
}
