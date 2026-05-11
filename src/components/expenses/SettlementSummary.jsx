import React from 'react';

/**
 * SettlementSummary Component
 * 
 * Displays a list of settlements between users in a group.
 * Format: User A → User B ₹XXX
 * 
 * Props:
 * @param {Array} settlements - List of settlement objects { from: { _id, username }, to: { _id, username }, amount }
 * @param {string} currentUserId - The ID of the currently logged-in user to determine if "Pay" button should show.
 * @param {Function} onPay - Callback function when "Pay" button is clicked.
 */
const SettlementSummary = ({ settlements, currentUserId, onPay }) => {
  if (!settlements || settlements.length === 0) {
    return (
      <div className="settlement-summary">
        <p>No settlements pending.</p>
      </div>
    );
  }

  return (
    <div className="settlement-summary">
      <h3>Settlement Summary</h3>
      <ul className="settlement-list">
        {settlements.map((settlement, index) => {
          const isOwer = settlement.from._id === currentUserId;
          
          return (
            <li key={index} className="settlement-item" style={{ marginBottom: '10px', listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <strong>{settlement.from.username}</strong>
                  {' → '}
                  <strong>{settlement.to.username}</strong>
                  {' '}
                  <span className="amount">₹{settlement.amount.toFixed(2)}</span>
                </span>
                
                {isOwer && (
                  <button 
                    onClick={() => onPay(settlement)}
                    className="pay-button"
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '5px 15px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Pay
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SettlementSummary;
