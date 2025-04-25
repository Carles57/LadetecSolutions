import React, { useState, useEffect } from 'react';
//import './EmployeePayments.css'; // Optional for styling

const EmployeePayments = () => {
  // State for the payments data
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  
  // Fetch data from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (activeOnly) params.append('active_only', 'true');
        
        const response = await fetch(`/api/employee_payments?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [startDate, endDate, activeOnly]);
  
  // Get current payments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Format date for display (assuming fecha is in 'YYYY-MM-DD' format)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  return (
    <div className="employee-payments-container">
      <h2>Employee Payments</h2>
      
      {/* Filter controls */}
      <div className="filters">
        <div className="date-filters">
          <label>
            Start Date:
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          
          <label>
            End Date:
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        
        <label className="active-filter">
          <input 
            type="checkbox" 
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Show Active Only
        </label>
        
        <button 
          className="reset-filters"
          onClick={() => {
            setStartDate('');
            setEndDate('');
            setActiveOnly(false);
          }}
        >
          Reset Filters
        </button>
      </div>
      
      {/* Payments table */}
      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Hourly Rate</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.length > 0 ? (
            currentPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.id_employee}</td>
                <td>${payment.tasa_horaria?.toFixed(2) || '0.00'}</td>
                <td>{formatDate(payment.fecha)}</td>
                <td>${payment.total_devengar?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status ${payment.activo ? 'active' : 'inactive'}`}>
                    {payment.activo ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No payments found</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination controls */}
      {payments.length > itemsPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      
      {/* Summary info */}
      <div className="summary">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, payments.length)} of {payments.length} entries
      </div>
    </div>
  );
};

export default EmployeePayments;