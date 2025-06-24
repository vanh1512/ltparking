// import './App.css';

// import * as React from 'react';

// import Router from '@components/Router';
// import SessionStore from '@stores/sessionStore';
// import Stores from '@stores/storeIdentifier';
// import { inject } from 'mobx-react';
// import signalRAspNetCoreHelper from '@lib/signalRAspNetCoreHelper';
// import { stores } from './stores/storeInitializer';

// export interface IAppProps {
// 	sessionStore?: SessionStore;
// }

// @inject(Stores.SessionStore)
// class App extends React.Component<IAppProps> {
// 	state = {
// 		isLoadDone: false,
// 	}
// 	async componentDidMount() {
// 		const session = this.props.sessionStore;
// 		await stores.settingStore.getAll();
// 		await session!.getCurrentLoginInformations();

// 		if (session!.isUserLogin() == true) {
// 			let user = session!.getUserLogin();
// 			await signalRAspNetCoreHelper.initConnection();
// 			await signalRAspNetCoreHelper.startConnection(user.id);

// 		}
// 		this.setState({ isLoadDone: !this.state.isLoadDone });
// 	}

// 	public render() {
// 		return <Router />;
// 	}
// }

// export default App;
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
      setText('');
    }
  };

  const detectPlate = () => {
    if (!image) return;
    setLoading(true);

    Tesseract.recognize(
      image,
      'eng',
      {
        logger: m => console.log(m) // shows progress in console
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setText('Error detecting text');
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 License Plate Detector</h2>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        style={{ marginBottom: 20 }}
      />

      {image && (
        <div>
          <img src={image} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }} />
          <br /><br />
          <button onClick={detectPlate} disabled={loading}>
            {loading ? 'Detecting...' : 'Detect License Plate'}
          </button>
        </div>
      )}

      {text && (
        <div style={{ marginTop: 20 }}>
          <h3>📄 Detected Text:</h3>
          <pre style={{ background: '#f8f8f8', padding: '10px' }}>{text}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
