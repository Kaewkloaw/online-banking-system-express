import { useEffect, useState } from "react";
import Swal, { SweetAlertIcon } from "sweetalert2";
import React from "react";
import axios from "axios";
import { WalletData } from "../../model/Wallet";
import "./TransferPage.css";

const TransferPage = () => {
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const [targetWallet, setTargetWallet] = useState<string>("");

  const responseSwal = (title: string, text: string, icon: SweetAlertIcon) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const queryWallet = async (email: string) => {
    const response = await axios.get(
      import.meta.env.VITE_SERVER_URI + "/api/accounts/" + email
    );
    if (response.data.length > 0) {
        setWalletData(response.data);
    } else {
      responseSwal("No wallet found", "", "error");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(parseInt(event.target.value));
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "customer") {
      responseSwal("You are not authorized to access this page", "We are redirecting you to the homepage", "error").then(() => {
        window.location.href = "/";
      });
    }
    queryWallet(localStorage.getItem("username") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(import.meta.env.VITE_SERVER_URI + "/api/transactions/deposit", {
      amount: amount,
      customer_username: walletData[selectedWallet].customer_email,
      account_id: walletData[selectedWallet].account_id
    });
    if (response.status === 201) {
      responseSwal("Deposit successfully", "", "success").then(() => {
        window.location.href = "/home";
      });
    } else {
      responseSwal("Deposit failed", "", "error");
    }

  };

  return (
    <div className="homepage_container">
      <div className="flex w-100vw header-container">
        <h1 className="text-white text-3xl pt-8 pb-8 px-16">Transfer</h1>
      </div>
      <div className="px-16 w-3/4">
          <h3 className="my-4 text-xl font-medium text-gray-900">Choose your destination</h3>
    <ul className="grid gap-6 grid-cols-3">
        <li>
            <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required />
            <label htmlFor="hosting-small" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                <div className="block">
                    <div className="w-full text-lg font-semibold">to TWJ Bank</div>
                    <div className="w-full">โอนเงินภายในธนาคาร</div>
                </div>
                <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </label>
        </li>
        <li>
            <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer"/>
            <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="block">
                    <div className="w-full text-lg font-semibold">Outside TWJ Bank</div>
                    <div className="w-full">โอนเงินธนาคารอื่น</div>
                </div>
                <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </label>
        </li>
        <li>
            <input type="radio" id="hosting-large" name="hosting" value="hosting-large" className="hidden peer"  />
            <label htmlFor="hosting-large" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                <div className="block">
                    <div className="w-full text-lg font-semibold">PromptPay</div>
                    <div className="w-full">โอนเงินผ่าน PromptPay</div>
                </div>
                <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </label>
        </li>
    </ul>
</div>
      <h3 className="mt-4 ml-16 text-xl font-medium text-gray-900">Transfer Information</h3>
      <div className="flex flex-1">
      <form
        className="ml-16 w-3/5 bg-slate-900 rounded-lg my-4 p-12"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-1 justify-between items-center">
          {/* Select Your Wallet */}
            <form className="max-w-sm w-1/2">
              <label
                htmlFor="wallets"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your account
              </label>
              <select
                onChange={handleChange}
                id="wallets"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {walletData.map((wallet, index) => {
                  return (
                    <option key={index} value={index}>
                      {wallet.account_id} | {wallet.first_name} - {wallet.account_type_name}
                    </option>
                  );
                })}
              </select>
            </form>

            <div>
              
              <svg className="w-10 h-5 mx-6 mt-6 rtl:rotate-180 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </div>

            <div className="max-w-sm w-1/2">
                      <label
                        htmlFor="national_card_id"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Target Account ID
                      </label>
                      <input
                        type="text"
                        name="national_card_id"
                        id="national_card_id"
                        value={targetWallet}
                        onChange={(e) => setTargetWallet(e.target.value)}
                        className="outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ex. 1100800000000"
                        required
                      />
                    </div>
        </div>
        <div className="my-5">
          <label
            htmlFor="amount"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Amount
          </label>
          <input
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            min={1}
            id="amount"
            className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-10 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-3xl">Your balance : ฿ {walletData[selectedWallet].balance}</h1>
        <img src="pocket.svg" className="p-1" width={300}></img>
      </div>
      </div>
    </div>
  );
};

export default TransferPage;
