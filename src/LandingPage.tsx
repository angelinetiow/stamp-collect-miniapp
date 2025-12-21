import './LandingPage.css';
import './styles/typography.css';

import { Flex } from "@mantine/core";
import { IconChevronLeft, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  STATIC_USER,
  STATIC_PRIZES,
  HOW_TO_COLLECT_STEPS,
  selectPrizeByProbability,
  formatPrizeName,
  getPrizeImage,
  formatValidityPeriod,
  Prize,
  UserInfo,
} from './data/staticData';

export const LandingPage: React.FC = () => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [userInfo] = useState<UserInfo>(STATIC_USER);
  
  const handleRedeemClick = () => {
    if (totalCollected === 7) {
      const wonPrize = selectPrizeByProbability(STATIC_PRIZES);
      
      if (!wonPrize) {
        console.warn('No prize selected');
        return;
      }
      
      setSelectedPrize(wonPrize);
      setIsRewardModalOpen(true);
    }
  };

  const closeRewardModal = () => {
    setIsRewardModalOpen(false);
    // Reset stamps after redemption
    setCollectedStamps([false, false, false, false, false, false, false]);
    setSelectedPrize(null);
  };
  
  const [rewardStampStun, setRewardStampStun] = useState(false);
  const [rewardStampShrinking, setRewardStampShrinking] = useState(false);
  const [storeStampStun, setStoreStampStun] = useState([false, false, false, false, false, false]);
  const [storeStampShrinking, setStoreStampShrinking] = useState([false, false, false, false, false, false]);
  const [collectedStamps, setCollectedStamps] = useState([false, false, false, false, false, false, false]);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isStampCollectedModalOpen, setIsStampCollectedModalOpen] = useState(false);
  const [isRewardStampCollectedModalOpen, setIsRewardStampCollectedModalOpen] = useState(false);
  const [currentStampIndex, setCurrentStampIndex] = useState<number | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const totalCollected = collectedStamps.filter(Boolean).length;

  const openInstructionModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsInstructionModalOpen(true);
  };

  const closeInstructionModal = () => {
    setShowInstructionModal(false);
    setTimeout(() => {
      setIsInstructionModalOpen(false);
    }, 300);
  };

  // Generate QR code with user info
  const generateQRCode = async () => {
    try {
      const baseUrl = window.location.origin;
      const qrData = `${baseUrl}/collect?userId=${encodeURIComponent(userInfo.userId)}&username=${encodeURIComponent(userInfo.username)}`;
      
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleStampClick = (stampIndex: number) => {
    // Find the first uncollected stamp index
    const nextUncollectedIndex = collectedStamps.findIndex((collected) => !collected);
    // Only allow collecting if this is the next uncollected stamp in sequence
    if (stampIndex === nextUncollectedIndex) {
      setCurrentStampIndex(stampIndex);
      // Generate QR code and show QR modal
      generateQRCode();
      setIsQRModalOpen(true);
    }
  };

  // Collect stamp with animation - simulates stamp collection
  const collectStamp = (stampIndex: number, isRewardStamp: boolean) => {
    if (stampIndex === 6 || isRewardStamp) {
      // Reward stamp - start animation
      setRewardStampStun(true);
      setTimeout(() => {
        setRewardStampStun(false);
        setRewardStampShrinking(true);
        setTimeout(() => {
          setCollectedStamps(prev => {
            const newStamps = [...prev];
            newStamps[stampIndex] = true;
            return newStamps;
          });
          setRewardStampShrinking(false);
          setIsRewardStampCollectedModalOpen(true);
        }, 800);
      }, 400);
    } else {
      // Store stamp - start animation
      const newStoreStampStun = [...storeStampStun];
      newStoreStampStun[stampIndex] = true;
      setStoreStampStun(newStoreStampStun);
      
      setTimeout(() => {
        const stunArray = [...storeStampStun];
        stunArray[stampIndex] = false;
        setStoreStampStun(stunArray);
        
        const shrinkArray = [...storeStampShrinking];
        shrinkArray[stampIndex] = true;
        setStoreStampShrinking(shrinkArray);
        
        setTimeout(() => {
          setCollectedStamps(prev => {
            const newStamps = [...prev];
            newStamps[stampIndex] = true;
            return newStamps;
          });
          
          const shrinkEndArray = [...storeStampShrinking];
          shrinkEndArray[stampIndex] = false;
          setStoreStampShrinking(shrinkEndArray);
          setIsStampCollectedModalOpen(true);
        }, 800);
      }, 400);
    }
  };

  // Simulate stamp collection when clicking "Done" on QR modal (for demo purposes)
  const handleQRDone = () => {
    setIsQRModalOpen(false);
    if (currentStampIndex !== null) {
      collectStamp(currentStampIndex, currentStampIndex === 6);
    }
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
    setCurrentStampIndex(null);
  };

  const confirmStampCollection = () => {
    setIsStampCollectedModalOpen(false);
    setCurrentStampIndex(null);
  };

  const confirmRewardStampCollection = () => {
    setIsRewardStampCollectedModalOpen(false);
    setCurrentStampIndex(null);
  };

  const closeStampModal = () => {
    setIsStampCollectedModalOpen(false);
    setCurrentStampIndex(null);
  };

  const closeRewardStampModal = () => {
    setIsRewardStampCollectedModalOpen(false);
    setCurrentStampIndex(null);
  };

  useEffect(() => {
    if (isInstructionModalOpen) {
      setTimeout(() => setShowInstructionModal(true), 10);
    }
  }, [isInstructionModalOpen]);
  
  const handleGoBack = () => {
    console.log('Back button clicked - demo mode');
  };

  return (
    <div className="landing-bg">
      <div className="landing-container">
        <div className="landing-header">
          <IconChevronLeft
            size={24}
            color="#1D1D1D"
            onClick={handleGoBack}
            className="back-btn"
          />
          <h3 className="heading3">Stamp Rewards</h3>
        </div>
        <div className="landing-title">
          <div className="title-banner">
            <span className="banner-text">VISIT, STAMP, WIN</span>
          </div>
          <h2 className="heading2">
            <span className="gradient-text">Unlock Rewards as You Explore</span>
          </h2>
          <p className="body2 text">Turn your visits into rewards by collecting stamps!</p>
        </div>
        <div className="stamps-section">
          <div className={`stamps-grid stamps-collected-${totalCollected}`}>
            {/* Row 1: Stamp1 - Line - Stamp2 */}
            <div className="stamps-row stamps-row-1">
              <div 
                className="stamp-circle" 
                style={{
                  cursor: collectedStamps[0] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(0)}
              >
                <img 
                  src={`./svg/${collectedStamps[0] || storeStampStun[0] || storeStampShrinking[0] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 1" 
                  className={`stamp-svg${storeStampStun[0] ? ' big-stun' : ''}${storeStampShrinking[0] ? ' big-to-small' : ''}`}
                />
              </div>
              <div className="line-connector">
                <img 
                  src="./svg/line-default.svg" 
                  alt="line connector" 
                  className="connector-svg"
                />
              </div>
              <div 
                className="stamp-circle stamp2-container" 
                style={{
                  position: 'relative',
                  cursor: collectedStamps[1] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(1)}
              >
                <img 
                  src={`./svg/${collectedStamps[1] || storeStampStun[1] || storeStampShrinking[1] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 2" 
                  className={`stamp-svg${storeStampStun[1] ? ' big-stun' : ''}${storeStampShrinking[1] ? ' big-to-small' : ''}`}
                />
                {/* Right curve connecting stamp 2 to stamp 3 */}
                <div className="curve-connector right-curve">
                  <img 
                    src="./svg/right curve-default.svg" 
                    alt="right curve connector" 
                    className="connector-svg"
                  />
                </div>
              </div>
            </div>
            
            {/* Row 2: Stamp5 - Line - Stamp4 - Line - Stamp3 */}
            <div className="stamps-row stamps-row-2">
              <div 
                className="stamp-circle stamp5-container" 
                style={{
                  position: 'relative',
                  cursor: collectedStamps[4] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(4)}
              >
                <img 
                  src={`./svg/${collectedStamps[4] || storeStampStun[4] || storeStampShrinking[4] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 5" 
                  className={`stamp-svg${storeStampStun[4] ? ' big-stun' : ''}${storeStampShrinking[4] ? ' big-to-small' : ''}`}
                />
                {/* Left curve connecting stamp 5 to stamp 6 */}
                <div className="curve-connector left-curve">
                  <img 
                    src="./svg/left curve-default.svg" 
                    alt="left curve connector" 
                    className="connector-svg"
                  />
                </div>
              </div>
              <div className="line-connector">
                <img 
                  src="./svg/line-default.svg" 
                  alt="line connector" 
                  className="connector-svg"
                />
              </div>
              <div 
                className="stamp-circle" 
                style={{
                  cursor: collectedStamps[3] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(3)}
              >
                <img 
                  src={`./svg/${collectedStamps[3] || storeStampStun[3] || storeStampShrinking[3] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 4" 
                  className={`stamp-svg${storeStampStun[3] ? ' big-stun' : ''}${storeStampShrinking[3] ? ' big-to-small' : ''}`}
                />
              </div>
              <div className="line-connector">
                <img 
                  src="./svg/line-default.svg" 
                  alt="line connector" 
                  className="connector-svg"
                />
              </div>
              <div 
                className="stamp-circle" 
                style={{
                  cursor: collectedStamps[2] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(2)}
              >
                <img 
                  src={`./svg/${collectedStamps[2] || storeStampStun[2] || storeStampShrinking[2] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 3" 
                  className={`stamp-svg${storeStampStun[2] ? ' big-stun' : ''}${storeStampShrinking[2] ? ' big-to-small' : ''}`}
                />
              </div>
            </div>
            
            {/* Row 3: Stamp6 - Line - Stamp7/Reward */}
            <div className="stamps-row stamps-row-3">
              <div 
                className="stamp-circle" 
                style={{
                  cursor: collectedStamps[5] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(5)}
              >
                <img 
                  src={`./svg/${collectedStamps[5] || storeStampStun[5] || storeStampShrinking[5] ? 'store stamp-filled' : 'store stamp-default'}.svg`} 
                  alt="Store stamp 6" 
                  className={`stamp-svg${storeStampStun[5] ? ' big-stun' : ''}${storeStampShrinking[5] ? ' big-to-small' : ''}`}
                />
              </div>
              <div className="line-connector">
                <img 
                  src="./svg/line-default.svg" 
                  alt="line connector" 
                  className="connector-svg"
                />
              </div>
              <div 
                className="stamp-circle" 
                style={{
                  cursor: collectedStamps[6] ? 'default' : 'pointer'
                }}
                onClick={() => handleStampClick(6)}
              >
                <img 
                  src={`./svg/${collectedStamps[6] || rewardStampStun || rewardStampShrinking ? 'reward stamp-filled' : 'reward stamp-default'}.svg`} 
                  alt="Reward stamp" 
                  className={`stamp-svg${rewardStampStun ? ' big-stun' : ''}${rewardStampShrinking ? ' big-to-small' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="buttongroup">
            <button className="redeem-btn heading4" disabled={totalCollected < 7} onClick={handleRedeemClick}>Redeem</button>
            <div className="stamp-count body3 text">You've collected {totalCollected}/7 stamps.</div>
          </div>
          <a href="#" className="how-to-link body3" onClick={openInstructionModal}>How to collect stamps?</a>
        </div>
      </div>
      
      {/* Reward Modal */}
      {isRewardModalOpen && (
        <div className="modal-overlay centered show" style={{overflow: 'visible'}} onClick={closeRewardModal}>
          <div className="reward-modal" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible'}} onClick={e => e.stopPropagation()}>
            <div className="reward-ray-bg" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, width: '600px', height: '600px', pointerEvents: 'none'}}>
              <svg className="reward-ray-svg reward-ray-transition" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%'}}>
                <image href="./svg/ray-sparkle.svg" x="0" y="0" width="600" height="600" />
              </svg>
            </div>
            <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
              <button className="modal-close-btn" style={{position: 'absolute', top: 16, right: 16, color: '#fff'}} onClick={closeRewardModal}>
                <IconX size={28} color="#fff" />
              </button>
              <div className="reward-modal-content">
                <h2 className="heading3 reward-modal-title" style={{marginTop: '48px'}}>Congratulations!</h2>
                {selectedPrize && (
                  <>
                    {selectedPrize.prizeType === 'voucher' ? (
                      <div className="reward-voucher-card">
                        <img className="reward-voucher-img" src={getPrizeImage(selectedPrize)} alt={formatPrizeName(selectedPrize)} />
                        <div className="reward-voucher-info">
                          <div className="reward-voucher-title heading4">{formatPrizeName(selectedPrize)}</div>
                          <div className="reward-voucher-valid body4">
                            {formatValidityPeriod(selectedPrize)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="reward-token-display" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0px',
                        marginTop: '24px',
                        marginBottom: '24px'
                      }}>
                        <div style={{ position: 'relative', width: '200px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{
                            position: 'absolute',
                            left: '20px',
                            top: '0px',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 2
                          }}>
                            <img src={getPrizeImage(selectedPrize)} alt="token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          
                          <div style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 1
                          }}>
                            <img src={getPrizeImage(selectedPrize)} alt="token" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fff',
                            borderRadius: '20px',
                            padding: '4px 16px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#000',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 10
                          }}>
                            +{selectedPrize.tokenPerUser || selectedPrize.totalTokenQuantity}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="body3 reward-modal-subtitle">
                      Hooray! You get {formatPrizeName(selectedPrize)}!
                    </div>
                  </>
                )}
                <button className="redeem-btn heading4" onClick={closeRewardModal}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* How to Collect Stamps Modal */}
      {isInstructionModalOpen && (
        <div className={`modal-overlay ${showInstructionModal ? 'show' : ''}`} onClick={closeInstructionModal}>
          <div className={`modal-content ${showInstructionModal ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-close">
              <button className="modal-close-btn" onClick={closeInstructionModal}>
                <IconX size={24} />
              </button>
            </div>
            <div className="modal-header">
              <h3 className="heading5 modal-title">How to Collect Stamps?</h3>
            </div>
            <div className="modal-body">
              <ol className="instructions-list">
                {HOW_TO_COLLECT_STEPS.map((step, index) => (
                  <li key={index} className="body4">{step}</li>
                ))}
              </ol>
              <div className="terms-section">
                <ul className="terms-list">
                  <li className="description1">By participating the draw you are agreeing to these draw terms and conditions.</li>
                  <li className="description1">We reserve the right to amend these terms and conditions at any time without prior notice.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Membership Modal */}
      {isQRModalOpen && (
        <div className="modal-overlay centered show" onClick={closeQRModal}>
          <div className="qr-modal" onClick={handleQRDone}>
            <div className="qr-modal-header">
              <button className="qr-close-btn" onClick={(e) => { e.stopPropagation(); closeQRModal(); }}>
                <IconX size={24} color="#333" />
              </button>
            </div>
            <div className="qr-modal-content">
              <h2 className="qr-modal-title">Membership QR Code</h2>
              <div className="qr-code-container">
                <img src="./svg/membership-qr.svg" alt="Membership QR Code" className="qr-code-img" />
              </div>
              <div className="qr-username">{userInfo.username}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stamp Collected Modal (for stamps 1-4) */}
      {isStampCollectedModalOpen && (
        <div className="modal-overlay centered show" onClick={closeStampModal}>
          <div className="stamp-collected-modal" onClick={(e) => e.stopPropagation()}>
            <div className="stamp-collected-content">
              <div className="stamp-collected-header">
                <div className="stamp-collected-image">
                  <img src="./svg/store stamp-filled.svg" alt="Stamp collected" />
                </div>
                <h2 className="body2">Stamp Collected!</h2>
                <p className="body3 stamp-collected-text">
                  You have successfully collected a stamp! You can collect <span className="stamp-collected-text-semibold">only one stamp per store per day.</span> Visit other stores to collect more stamps.
                </p>
              </div>
              <button className="stamp-collected-btn heading5" onClick={confirmStampCollection}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Stamp Collected Modal (for 5th stamp) */}
      {isRewardStampCollectedModalOpen && (
        <div className="modal-overlay centered show" onClick={closeRewardStampModal}>
          <div className="reward-stamp-collected-modal" onClick={(e) => e.stopPropagation()}>
            <div className="stamp-collected-content">
              <div className="stamp-collected-header">
                <div className="reward-stamp-collected-image">
                  <img src="./svg/stamp illustration.svg" alt="Reward stamp collected" />
                </div>
                <h2 className="body2">Stamp Collected!</h2>
                <p className="body3 stamp-collected-text">You have successfully collected all stamps!</p>
                <p className="body3 stamp-collected-text">Redeem your reward now!</p>    
              </div>
              <button className="stamp-collected-btn heading5" onClick={confirmRewardStampCollection}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

