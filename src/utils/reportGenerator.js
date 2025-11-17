import * as XLSX from 'xlsx';

/**
 * Generate an Excel report with transactions and budgets data
 * @param {Array} transactions - List of transaction objects
 * @param {Array} budgets - List of budget objects
 * @param {String} filename - Output filename (without extension)
 */
export const generateExcelReport = (transactions = [], budgets = [], filename = 'Financial_Report') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // ===== TRANSACTIONS SHEET =====
    if (transactions && transactions.length > 0) {
      const transactionsData = transactions.map((t) => ({
        'Transaction ID': t.id || 'N/A',
        'Date': t.date || 'N/A',
        'Type': t.type || 'N/A',
        'Category': t.category || 'N/A',
        'Amount': t.amount || 0,
        'Description': t.description || 'N/A',
        'Budget': t.budget || 'N/A',
      }));

      const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
      
      // Set column widths
      transactionsSheet['!cols'] = [
        { wch: 12 }, // Transaction ID
        { wch: 12 }, // Date
        { wch: 10 }, // Type
        { wch: 15 }, // Category
        { wch: 12 }, // Amount
        { wch: 25 }, // Description
        { wch: 12 }, // Budget
      ];

      XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
    }

    // ===== BUDGETS SHEET =====
    if (budgets && budgets.length > 0) {
      const budgetsData = budgets.map((b) => ({
        'Budget ID': b.id || 'N/A',
        'Category': b.category || 'N/A',
        'Amount': b.amount || 0,
        'Spent': b.spent || 0,
        'Remaining': (parseFloat(b.amount) || 0) - (parseFloat(b.spent) || 0),
        'Usage %': b.amount > 0 ? (((parseFloat(b.spent) || 0) / parseFloat(b.amount)) * 100).toFixed(2) : '0',
        'Created At': b.created_at || 'N/A',
      }));

      const budgetsSheet = XLSX.utils.json_to_sheet(budgetsData);
      
      // Set column widths
      budgetsSheet['!cols'] = [
        { wch: 12 }, // Budget ID
        { wch: 15 }, // Category
        { wch: 12 }, // Amount
        { wch: 12 }, // Spent
        { wch: 12 }, // Remaining
        { wch: 12 }, // Usage %
        { wch: 20 }, // Created At
      ];

      XLSX.utils.book_append_sheet(workbook, budgetsSheet, 'Budgets');
    }

    // ===== SUMMARY SHEET =====
    const summary = {
      'Total Transactions': transactions?.length || 0,
      'Total Income': transactions
        ?.filter((t) => t.type === 'income')
        ?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
        ?.toFixed(2) || '0.00',
      'Total Expenses': transactions
        ?.filter((t) => t.type === 'expense')
        ?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
        ?.toFixed(2) || '0.00',
      'Total Budgets': budgets?.length || 0,
      'Total Budget Amount': budgets
        ?.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
        ?.toFixed(2) || '0.00',
      'Total Spent': budgets
        ?.reduce((sum, b) => sum + parseFloat(b.spent || 0), 0)
        ?.toFixed(2) || '0.00',
      'Report Generated': new Date().toLocaleString(),
    };

    const summaryData = Object.entries(summary).map(([key, value]) => ({
      'Metric': key,
      'Value': value,
    }));

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [
      { wch: 25 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Write the workbook to a file
    XLSX.writeFile(workbook, `<RuPaySymbol showLogo={false} />{filename}_<RuPaySymbol showLogo={false} />{new Date().toISOString().split('T')[0]}.xlsx`);

    return { success: true, message: 'Report generated successfully!' };
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, message: `Error: <RuPaySymbol showLogo={false} />{error.message}` };
  }
};
