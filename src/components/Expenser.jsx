import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CreditCard, AlertTriangle } from "lucide-react";

const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Expenser = () => {
  const [balance, setBalance] = useState(0);
  const [inputBalance, setInputBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("spending");
  const [transactions, setTransactions] = useState([]);
  const [budgetPlan, setBudgetPlan] = useState(null);
  const [warning, setWarning] = useState("");
  const [buttonLabel, setButtonLabel] = useState("WALLET GETTING LIGHTER");
  const [isBudgetSet, setIsBudgetSet] = useState(false);
  const [dailyBudgets, setDailyBudgets] = useState(null);

  const fetchData = async (userId) => {
    try {
      const docRef = doc(db, "expenser", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalance(data.balance);
        setTransactions(data.transactions || []);
        setBudgetPlan(data.budgetPlan || null);
        setIsBudgetSet(!!data.balance);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setWarning("Failed to load data from database");
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        fetchData(user.uid); // Pass user.uid to fetchData
      } else {
        console.log("No user is signed in.");
        setWarning("Please sign in to use the app");
        // Reset states when user is not signed in
        setBalance(0);
        setTransactions([]);
        setBudgetPlan(null);
        setIsBudgetSet(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array since we want this to run only once on mount

  // Modify saveToDatabase to use user ID
  const saveToDatabase = async (newBalance, newTransactions, newBudgetPlan) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setWarning("Please sign in to save data");
      return;
    }

    try {
      await setDoc(doc(db, "expenser", user.uid), {
        balance: newBalance,
        transactions: newTransactions,
        budgetPlan: newBudgetPlan,
      });
    } catch (error) {
      console.error("Error saving to database:", error);
      setWarning("Failed to save data to database");
    }
  };
  const handleBalanceChange = (e) => {
    setInputBalance(e.target.value);
  };

  const handleSetBalance = async () => {
    const newBalance = Number(inputBalance);
    setBalance(newBalance);
    let plan;

    if (newBalance <= 1500) {
      plan = {
        savings: newBalance * 0.4,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.2,
        emergency: newBalance * 0.1,
      };
    } else if (newBalance <= 3000) {
      plan = {
        savings: newBalance * 0.45,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.15,
        emergency: newBalance * 0.1,
      };
    } else {
      plan = {
        savings: newBalance * 0.5,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.1,
        emergency: newBalance * 0.1,
      };
    }
    setBudgetPlan(plan);
    setIsBudgetSet(true);
    setWarning("");
    setInputBalance("");

    await saveToDatabase(newBalance, transactions, plan);
  };

  const handleAddMoney = async () => {
    const transactionAmount = parseFloat(amount);
    const newBalance = balance + transactionAmount;

    let plan;
    if (newBalance <= 1500) {
      plan = {
        savings: newBalance * 0.4,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.2,
        emergency: newBalance * 0.1,
      };
    } else if (newBalance <= 3000) {
      plan = {
        savings: newBalance * 0.45,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.15,
        emergency: newBalance * 0.1,
      };
    } else {
      plan = {
        savings: newBalance * 0.5,
        spending: newBalance * 0.3,
        enjoyment: newBalance * 0.1,
        emergency: newBalance * 0.1,
      };
    }

    const newTransaction = {
      id: transactions.length + 1,
      type: "Credit",
      amount: transactionAmount,
      description: description,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const newTransactions = [newTransaction, ...transactions];

    setBalance(newBalance);
    setBudgetPlan(plan);
    setTransactions(newTransactions);
    setAmount("");
    setDescription("");
    setType("spending");
    setWarning("");

    await saveToDatabase(newBalance, newTransactions, plan);
  };

  const handleDeductMoney = async () => {
    const transactionAmount = parseFloat(amount);

    if (transactionAmount > balance) {
      setWarning("Warning: Insufficient balance!");
      return;
    }

    let updatedBudgetPlan = { ...budgetPlan };
    if (budgetPlan) {
      let remainingAmount = transactionAmount;
      let budgetCategories;

      if (type === "spending") {
        budgetCategories = ["spending", "emergency", "enjoyment"];
      } else if (type === "enjoyment") {
        budgetCategories = ["enjoyment", "emergency", "spending"];
      } else if (type === "emergency") {
        budgetCategories = ["emergency", "spending", "enjoyment"];
      }

      for (const category of budgetCategories) {
        if (remainingAmount <= 0) break;

        if (updatedBudgetPlan[category] > 0) {
          const deductionAmount = Math.min(
            updatedBudgetPlan[category],
            remainingAmount
          );
          updatedBudgetPlan[category] -= deductionAmount;
          remainingAmount -= deductionAmount;
        }
      }

      if (remainingAmount > 0) {
        if (updatedBudgetPlan.savings >= remainingAmount) {
          updatedBudgetPlan.savings -= remainingAmount;
          setWarning(
            "Warning: All budget categories are depleted, deducting from savings!"
          );
        } else {
          setWarning(
            "Warning: All budget categories are depleted, and savings are insufficient!"
          );
          return;
        }
      }
    }

    const newBalance = balance - transactionAmount;
    const newTransaction = {
      id: transactions.length + 1,
      type: type.charAt(0).toUpperCase() + type.slice(1),
      amount: transactionAmount,
      description: description,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const newTransactions = [newTransaction, ...transactions];

    setBalance(newBalance);
    setBudgetPlan(updatedBudgetPlan);
    setTransactions(newTransactions);
    setAmount("");
    setDescription("");
    setType("spending");

    await saveToDatabase(newBalance, newTransactions, updatedBudgetPlan);
  };

  const handleTransactionButtonClick = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setWarning("Please enter a valid amount");
      return;
    }

    if (type === "credit") {
      handleAddMoney();
    } else {
      handleDeductMoney();
    }
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setButtonLabel(
      selectedType === "credit" ? "YAY, MORE MONEY!" : "WALLET GETTING LIGHTER"
    );
  };

  const getRemainingDays = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate() + 1;
  };

  useEffect(() => {
    if (budgetPlan) {
      const remainingDays = getRemainingDays();
      setDailyBudgets({
        spending: budgetPlan.spending / remainingDays,
        enjoyment: budgetPlan.enjoyment / remainingDays,
        emergency: budgetPlan.emergency / remainingDays,
        savings: budgetPlan.savings / remainingDays,
      });
    }
  }, [budgetPlan]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#30313d]/10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-[#30313d]">
              Current Balance: {formatMoney(balance)}
            </h2>
          </div>

          {!isBudgetSet && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="number"
                placeholder="Enter your current bank balance"
                value={inputBalance}
                onChange={handleBalanceChange}
                className="w-full sm:w-2/3 border border-[#30313d]/20 rounded-lg p-3 text-[#30313d] focus:ring-2 focus:ring-[#06AB78] focus:border-transparent transition-all outline-none"
              />
              <button
                onClick={handleSetBalance}
                className="w-full sm:w-1/3 bg-[#06AB78] text-white rounded-lg p-3 hover:bg-[#06AB78]/90 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Set Balance
              </button>
            </div>
          )}
        </div>

        {/* Budget Plan */}
        {budgetPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#30313d]/10">
            <h2 className="text-2xl font-bold text-[#30313d] mb-6">
              Budget Plan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(budgetPlan).map(([title, amount]) => (
                <div
                  key={title}
                  className="p-4 bg-[#30313d]/5 rounded-lg hover:bg-[#30313d]/10 transition-colors"
                >
                  <p className="font-medium text-[#30313d]/70 mb-1 capitalize">
                    {title}
                  </p>
                  <p className="text-xl font-bold text-[#30313d]">
                    {formatMoney(amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#30313d]/10">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-6 h-6 text-[#30313d]" />
            <h2 className="text-2xl font-bold text-[#30313d]">
              Add Transaction
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full sm:w-1/3 border border-[#30313d]/20 rounded-lg p-3 text-[#30313d] focus:ring-2 focus:ring-[#06AB78] focus:border-transparent transition-all outline-none"
            />
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full sm:w-1/3 border border-[#30313d]/20 rounded-lg p-3 text-[#30313d] focus:ring-2 focus:ring-[#06AB78] focus:border-transparent transition-all outline-none"
            />
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-full sm:w-1/3 border border-[#30313d]/20 rounded-lg p-3 text-[#30313d] focus:ring-2 focus:ring-[#06AB78] focus:border-transparent transition-all outline-none"
            >
              <option value="spending">Spending</option>
              <option value="enjoyment">Enjoyment</option>
              <option value="emergency">Emergency</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <button
            onClick={handleTransactionButtonClick}
            className={`w-full ${
              type === "credit"
                ? "bg-[#06AB78] hover:bg-[#06AB78]/90"
                : "bg-[#FF4B4B] hover:bg-[#FF4B4B]/90"
            } text-white rounded-lg p-3 transition-colors font-medium flex items-center justify-center gap-2`}
          >
            <CreditCard className="w-4 h-4" />
            {buttonLabel}
          </button>
        </div>

        {/* Warning Message */}
        {warning && (
          <div className="bg-[#FF4B4B]/10 border-l-4 border-[#FF4B4B] p-4 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#FF4B4B] flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-[#FF4B4B]">Warning</p>
              <p className="text-[#30313d]">{warning}</p>
            </div>
          </div>
        )}

        {/* Daily Budget */}
        {dailyBudgets && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#30313d]/10">
            <h2 className="text-2xl font-bold text-[#30313d] mb-4">
              Daily Budget ({getRemainingDays()} days remaining this month)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#30313d]/5 rounded-lg hover:bg-[#30313d]/10 transition-colors">
                <p className="font-medium text-[#30313d]/70 mb-1">
                  Daily Spending Limit
                </p>
                <p className="text-xl font-bold text-[#30313d]">
                  {formatMoney(dailyBudgets.spending)}
                </p>
              </div>
              <div className="p-4 bg-[#30313d]/5 rounded-lg hover:bg-[#30313d]/10 transition-colors">
                <p className="font-medium text-[#30313d]/70 mb-1">
                  Daily Enjoyment Limit
                </p>
                <p className="text-xl font-bold text-[#30313d]">
                  {formatMoney(dailyBudgets.enjoyment)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#30313d]/10">
          <h2 className="text-2xl font-bold text-[#30313d] mb-6">
            Transaction History
          </h2>
          {transactions.length > 0 ? (
            <ul className="divide-y divide-[#30313d]/10">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="py-4 hover:bg-[#30313d]/5 transition-colors"
                >
                  <div className="flex justify-between items-center px-2">
                    <div>
                      <p className="font-semibold text-[#30313d]">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-[#30313d]/60">
                        {transaction.date} at {transaction.time}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.type === "Credit"
                          ? "text-[#06AB78]"
                          : "text-[#FF4B4B]"
                      }`}
                    >
                      {transaction.type === "Credit" ? "+" : "-"}
                      {formatMoney(transaction.amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#30313d]/60">No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenser;
