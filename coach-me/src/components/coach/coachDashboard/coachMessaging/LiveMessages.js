import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMessageHistory,
    postMessage
} from '../../../../actions/coachActions';
import './coachMessaging.scss';
// import MessageCanvas from './MessageCanvas'
// import '@progress/kendo-theme-material/dist/all.css';

//Needs get request for messages  http://localhost:4000/twilioRoute/messagehistory
//Needs Post request to twilio  http://localhost:4000/twilioRoute/twilio

function LiveMessages(props) {
    console.log(props)
    const {clientprofile} = props
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    

    const [message, setMessage] = useState({
        message: '',
        Phone: ''

    });

    console.log('LiveMessages State', state);
    console.log('state.coach', state.coach);

    

    useEffect(() => {

        if(clientprofile&&clientprofile.clientPhone){
            (dispatch(getMessageHistory(clientprofile.clientPhone)))
            setMessage({...message, Phone:clientprofile.clientPhone})
        }
        

      

       
       
    }, [clientprofile]);

    useEffect( ()=>{
        const interval = setInterval(() => {
            dispatch(getMessageHistory(clientprofile&&clientprofile.clientPhone))
            
        }, 7000)
        return () => clearInterval(interval)

    }, [clientprofile])

    const handleInputChange = e => {
        setMessage({ ...message, message: e.target.value});

    };

    const submitNewMessage = e => {
        e.preventDefault();
        {
            dispatch(postMessage(message));
        }
    };
    return (
        <>
            {/* contains get request twilio data */}

            <div className='message-container'>
                {state.coach.messageHistory &&
                    state.coach.messageHistory.map((m, i) => (
                        <div
                            key={i}

                            className={`messages ${
                                m.direction === 'inbound' ? 'left' : 'right'
                            }`}

                        >
                            <p>{m.body}</p>
                            <p>{m.dateSent}</p>
                        </div>
                    ))}
            </div>
            <form onSubmit={submitNewMessage}>
                <textarea
                    rows='4'
                    cols='50'
                    onChange={handleInputChange}
                    value={message.message}
                    type='text'
                    placeholder='Type your message here'
                ></textarea>
                <button>Send</button>
            </form>
        </>
    );
}

export default LiveMessages;