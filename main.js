// Инициализация TonConnect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

// Рисуем кнопку подключения кошелька
tonConnectUI.renderWalletButton("#ton-connect-button");

// Обновляем надпись с адресом кошелька
tonConnectUI.onStatusChange((walletInfo) => {
  const el = document.getElementById("wallet-address");

  if (!walletInfo) {
    el.textContent = "Кошелёк не подключен";
    return;
  }

  el.textContent = "Подключен: " + walletInfo.account.address;
});

// ЛОГИКА КНОПКИ "ОПЛАТИТЬ"
document.getElementById("pay-btn").onclick = async () => {
  const amountStr = document.getElementById("pay-amount").value;
  const toAddress = document.getElementById("pay-to").value.trim();
  const status = document.getElementById("pay-status");

  status.textContent = "";

  if (!amountStr || Number(amountStr) <= 0) {
    status.textContent = "Укажи сумму в TON 👆";
    return;
  }

  if (!toAddress) {
    status.textContent = "Укажи адрес получателя 👆";
    return;
  }

  try {
    status.textContent = "Отправляем запрос в Tonkeeper…";

    const amountNano = Math.floor(Number(amountStr) * 1e9); // 1 TON = 1e9 nanoTON

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут
      messages: [
        {
          address: toAddress,
          amount: amountNano.toString()
        }
      ]
    });

    status.textContent = "Транзакция отправлена (если подтвердил) ✅";

  } catch (e) {
    console.log(e);
    status.textContent = "Отменено или ошибка: " + (e?.message || String(e)) + " ❌";
  }
};
};
