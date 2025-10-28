import { COLLECTION_ROUTES } from '@/lib/enums';
import { ICardReviewProps } from '@/lib/interfaces/tables';
import React, { useState } from 'react';
import { FaCar, FaEye, FaFolder, FaHome } from 'react-icons/fa';
import { FcViewDetails } from 'react-icons/fc';
import { GiReceiveMoney } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const CompletedLoans: React.FC<ICardReviewProps> = ({ apiData, onPhoneClick, handleNavigation }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDetails = (caseNo: string) => {
    navigate(COLLECTION_ROUTES.LOAN_DETAILS_PAGE.replace(':caseNo', caseNo));
  };

  const getCardColor = (dueEmi: any) => {
    if (dueEmi > 4) return 'border-red-500';
    if (dueEmi > 2) return 'border-green-500';
    return 'border-gray-300';
  };

  const handleShowContacts = (contacts: any) => {
    setSelectedContacts(contacts);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContacts([]);
  };

  return (
    <>
      <div className=" mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Complited Loan Records</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiData
            .filter((record) => {
              const dueEmi =
                record.emiAmount && record.dueEmiAmount
                  ? Math.ceil(Number(record.dueEmiAmount) / Number(record.emiAmount))
                  : 0;
              return dueEmi <= 0;
            })
            .map((record) => {
              const dueEmi =
                record.emiAmount && record.dueEmiAmount
                  ? Math.ceil(Number(record.dueEmiAmount) / Number(record.emiAmount))
                  : 0;
              const cardColor = getCardColor(dueEmi);

              return (
                <div key={record['caseNo']} className={`border p-4 sm:p-2 lg:p-4 shadow-lg rounded-md ${cardColor}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg lg:text-xl font-semibold">{record['caseNo']}</h2>
                    <p>
                      <strong className="text-sm font-normal">{dueEmi}</strong>
                    </p>
                    <span className="text-gray-900 font-[600] text-sm lg:text-base">{record.area || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p>{record.customer || 'N/A'}</p>
                    <p className="text-sm flex items-center">
                      {record.loanType?.toLowerCase() === 'vl' ? (
                        <>
                          <FaCar className="inline mr-2" />
                        </>
                      ) : record.loanType?.toLowerCase() === 'hl' ? (
                        <>
                          <FaHome className="inline mr-2" />
                        </>
                      ) : record.loanType?.toLowerCase() === 'cl' ? (
                        <>
                          <FaFolder className="inline mr-2" />
                        </>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>

                  <div className="space-y-2 ">
                    <p>
                      <strong className="text-sm font-normal">Contact No:</strong>{' '}
                      <span>
                        {record.contactNo && Array.isArray(record.contactNo) && record.contactNo.length > 1 ? (
                          <>
                            <span
                              onClick={() =>
                                record?.contactNo && record?.contactNo[0] && onPhoneClick(record.contactNo[0])
                              }
                              className="hover:text-blue-700 hover:underline cursor-pointer"
                            >
                              {record?.contactNo[0]}
                            </span>
                            ...{' '}
                            <span
                              onClick={() => handleShowContacts(record.contactNo)}
                              className="text-gray-500 cursor-pointer"
                            >
                              ({record.contactNo.length} more)
                            </span>
                          </>
                        ) : record.contactNo && Array.isArray(record.contactNo) && record.contactNo.length === 1 ? (
                          <span
                            onClick={() =>
                              record.contactNo && record?.contactNo[0] && onPhoneClick(record.contactNo[0])
                            }
                            className="hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            {record?.contactNo[0]}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex space-x-4">
                    <p>
                      <strong className="text-sm font-normal">EMI Amt:</strong> ₹{record.emiAmount || '0'}
                    </p>
                    <p>
                      <strong className="text-sm font-normal">Due EMI Amt:</strong> ₹{record.dueEmiAmount || '0'}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-between">
                    <button
                      onClick={() => handleNavigation(record.caseNo, `${COLLECTION_ROUTES.COLLECTION}`)}
                      className="bg-primary text-white py-2 px-4 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 relative shadow-md hover:bg-[#5a36b1] transition-all duration-300"
                    >
                      <GiReceiveMoney className="text-xl" />
                    </button>

                    <button
                      onClick={() => handleNavigation(record.caseNo, `${COLLECTION_ROUTES.FOLLOWUP}`)}
                      className=" bg-primary  py-2 px-4 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:text-white transition-all duration-300"
                    >
                      <FcViewDetails className="text-xl" />
                    </button>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm">
                      <strong className="font-normal">Last Payment Detail:</strong> {record.lastPaymentDetail || '0'}
                    </p>
                    <button
                      onClick={() => toggleDetails(record['caseNo'])}
                      className="border-2 border-blue-500 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-purple-700 bg-opacity-10 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Contact Numbers</h2>
            <ul className="space-y-2">
              {selectedContacts.map((contact, index) => (
                <li
                  onClick={() => onPhoneClick(contact)}
                  key={index}
                  className="text-blue-700 cursor-pointer border-b border-blue-700 pb-1"
                >
                  {contact}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompletedLoans;
