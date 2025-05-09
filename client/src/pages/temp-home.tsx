const TempHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">CryptoVault</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md text-center mb-6">
        A secure cryptography application for all your encryption needs
      </p>
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <p className="text-slate-900 dark:text-white font-medium mb-2">Basic Test Page</p>
        <p className="text-slate-600 dark:text-slate-300">
          This is a simple test page to verify that React rendering is working correctly.
        </p>
      </div>
    </div>
  );
};

export default TempHomePage;