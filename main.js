// Инициализация TonConnect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

// Рисуем кнопку подключения
tonConnectUI.renderWalletButton("#ton-connect-button");

// Когда кошелек подключается / отключается
tonConnectUI.onStatusChange(async (walletInfo) => {
  const addrEl = document.getElementById("wallet-address");
  const balEl = document.getElementById("wallet-balance");

  if (!walletInfo) {
    addrEl.textContent = "Кошелёк не подключен";
    balEl.textContent = "Баланс: —";
    return;
  }

  const address = walletInfo.account.address;
  addrEl.textContent = "Адрес: " + address;
  balEl.textContent = "Баланс: загружается…";

  try {
    // ✅ ПРОКСИ, чтобы браузер не блокировал CORS
    const url = "https://corsproxy.io/?https://tonapi.io/v2/accounts/" + address;
    const res = await fetch(url);
    const data = await res.json();

    const nano = data.balance || 0;
    const ton = nano / 1e9;

    balEl.textContent = "Баланс: " + ton.toFixed(4) + " TON";
  } catch (e) {
    console.log("balance error", e);
    balEl.textContent = "Баланс: ошибка API";
  }
});

// КНОПКА "ОПЛАТИТЬ"
document.getElementById("pay-btn").onclick = async () => {
  const amountStr = document.getElementById("pay-amount").value;
  const toAddress = document.getElementById("pay-to").value.trim();
  const status = document.getElementById("pay-status");

  status.textContent = "";

  if (!tonConnectUI.account) {
    status.textContent = "Сначала подключи кошелёк";
    return;
  }

  if (!amountStr || Number(amountStr) <= 0) {
    status.textContent = "Укажи сумму";
    return;
  }

  if (!toAddress) {
    status.textContent = "Укажи адрес получателя";
    return;
  }

  try {
    status.textContent = "Ожидаем подтверждение…";

    const amountNano = Math.floor(Number(amountStr) * 1e9);

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: toAddress,
          amount: amountNano.toString()
        }
      ]
    });

    status.textContent = "✅ Транзакция отправлена";

  } catch (e) {
    console.log("tx error", e);
    status.textContent = "❌ Отменено или ошибка";
  }
};
