import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import logo from "../../images/logo/logo-full.png";

function Login(props) {
  const navigate = useNavigate();
  const { changeBackground } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open('https://phantom.app/', '_blank');
  };

  const handleLogin = () => {
    checkConnection();
  };

  const sendTransaction = async () => {
    try {
      const provider = await getProvider();
      if (!provider) throw new Error("Wallet not found");

      const connection = new Connection("https://api.devnet.solana.com");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: new PublicKey("9y4Z4C5B3EEEUsGfVoxKaiDom7SSnfHgswgsh3KiydDw"), // Replace with the receiver's wallet address
          lamports: 0.001 * LAMPORTS_PER_SOL,
        })
      );

      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = provider.publicKey;

      let signed = await provider.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      // Redirect on success
      navigate('/dashboard'); // Replace with your dashboard route
    } catch (error) {
      console.error('Transaction failed', error);
      alert('Payment failed, please try again.'); // Or use a more sophisticated error handling
    }
  }; 
  const signMessage = async (provider) => {
    try {
      const message = new TextEncoder().encode("Signing in on DegenStats");
      const signedMessage = await provider.signMessage(message, "utf8");
      console.log("Signed message:", signedMessage);
      setShowModal(true);
    } catch (error) {
      console.error('Signing failed', error);
    }
  };

  const checkConnection = async () => {
    const provider = getProvider();
    if (provider && provider.isConnected) {
      setIsConnected(true);
      await signMessage(provider);
    } else if (provider) {
      provider.connect().then(async () => {
        console.log('Wallet connected!');
        setIsConnected(true);
        await signMessage(provider);
      }).catch((error) => {
        console.error('Connection failed', error);
      });
    }
  };

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
  }, []);

  return (
    <div className="page-wrapper">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="login-form style-1 justify-content-center" style={{ padding: '20px' }}>
          <div className="card flex justify-content center" style={{ padding: '40px' }}>
            <div className="card-body">
              <div className="logo-header text-center">
                {/* <Link to={"#"} className="logo">
                  <img src={logo} alt="" className="width-230 mCS_img_loaded" />
                </Link> */}
                <h1>Welcome to Degenstats</h1>
              </div>
              <div className="text-center bottom">
              <Button
        className="btn btn-primary button-md btn-block"
        onClick={handleLogin}
        disabled={isConnected}
      >
        {isConnected ? "Connected" : "Login with Phantom Wallet"}
      </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are Logged In. Please pay 0.1 SOL to access the dashboard.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={sendTransaction}>
            Pay 0.1 SOL
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(Login);
