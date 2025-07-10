
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../utils/authHeader';
import { decodeToken } from '../../contexts/UserContext';

function VerificationPopup({ onClose, email, code }) {
  // Local state to hold the user-entered verification code
  const [inputcode, setInputCode] = useState('');

  // Handle form submission for email verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the entered code matches the generated code
    if (inputcode === code) {
      try {

        // Use decoded token for userId instead of localStorage
        const decoded = decodeToken();
        const userId = decoded?.id;
        if (!userId) throw new Error('User ID not found in token');



        // Send verified email update to the server with Authorization header
        await axios.put(
          `${BASE_URLS.settings}/email/${userId}`,
          { email },
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );

        toast.success('Verification successful!');
        onClose(); // Close the popup after successful verification
      } catch (error) {
        console.error('There was an error verifying the email!', error);
        toast.error('Verification failed. Please try again.');
      }
    } else {
      // Show error if code does not match
      toast.error('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="verify-outer">
      <div className="verify-inner">
        <h1 className="verify-title">Email Verification</h1>
        <form className="verify-form" onSubmit={handleSubmit}>
          {/* Input field for verification code */}
          <label htmlFor="verifycode" className="verify-label">
            <strong>Enter The Verification Code </strong>
            <p style={{ fontSize: '12px' }}>The code sent to {email}</p>
          </label>
          <input
            type="text"
            name="verifycode"
            id="verifycode"
            placeholder="Enter Verification Code"
            className="verify-input"
            value={inputcode}
            onChange={(e) => setInputCode(e.target.value)}
            required
          />

          {/* Submit and cancel buttons */}
          <div className="verify-buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="back-btn" onClick={onClose}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerificationPopup;
