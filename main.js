const tonConnect = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json'
});

// ЭЛЕМЕНТЫ
const connectBtn = document.getElementById('ton-connect-button');
const walletAddressEl = document.getElementById('wallet-address');
const walletBalanceEl = document.getElementById('wallet-balance');
const payBtn = document.getElementById('pay-btn');
const payAmount = document.getElementById('pay-amount');
const payTo = document.getElementById('pay-to');
const payStatus = document.getElementById('pay-status');

// ПОДКЛЮЧЕНИЕ КОШЕЛЬКА
connectBtn.addEventListener('click', async () => {
  await tonConnect.connectWallet();
});

// ОБНОВЛЕНИЕ СОСТОЯНИЯ КОШЕЛЬКА
tonConnect.onStatusChange(async wallet => {
  if (!wallet) {
    walletAddressEl.textContent = 'Кошелёк не подключен';
    walletBalanceEl.textContent = '';
    return;
  }

  const address = wallet.account.address;
  walletAddressEl.textContent = 'Адрес: ' + address;

  // Баланс через API toncenter
  const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
  const data = await res.json();
  const balanceTON = (data.result / 1e9).toFixed(2);

  walletBalanceEl.textContent = 'Баланс: ' + balanceTON + ' TON';
});

// ОПЛАТА
payBtn.addEventListener('click', async () => {
  const amount = Number(payAmount.value);
  const to = payTo.value.trim();

  if (!amount || !to) {
    payStatus.textContent = '❌ Введите сумму и адрес';
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: to,
        amount: (amount * 1e9).toString()
      }
    ]
  };

  try {
    await tonConnect.sendTransaction(transaction);
    payStatus.textContent = '✅ Транзакция отправлена';
  } catch (e) {
    payStatus.textContent = '❌ Платёж отменён';
  }
});
