
const API_URL = "https://ceozkktjqwpwlnlnjujd.supabase.co/rest/v1/resell_products";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlb3pra3RqcXdwd2xubG5qdWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NDU1MzYsImV4cCI6MjA2MjUyMTUzNn0.xTiGx0O95vMiRdaE4KCuFh1XcB0Wr7uMVOyiP9NfD2w";

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

    if (data.length === 0) {
      resultBox.innerText = `[${sku}]
❌ 데이터가 없습니다.`;
      return;
    }

    const item = data[0];
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
    resultBox.innerText = "오류 발생: " + error;
  }
}
