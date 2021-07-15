import { h } from 'preact';
import { useState } from 'preact/compat';

import { Livechat } from '../../../api';
import I18n from '../../../i18n';
import PhoneAccept from '../../../icons/phone.svg';
import PhoneDecline from '../../../icons/phoneOff.svg';
import { Avatar } from '../../Avatar';
import { Button } from '../../Button';
import { Screen } from '../../Screen';
import { createClassName, getAvatarUrl } from '../../helpers';
import { parseDate } from '../MessageTime/index';
import styles from './styles.scss';


const DisplayCallIframe = (rid) => (
	<Screen.Content nopadding>
		<div className={createClassName(styles, 'iframe')}>
			<iframe style='height:100%' src={`${ Livechat.client.host }/meet/${ rid.rid }`} />
		</div>
	</Screen.Content>
);


export const ShowCallTime = (props) => (
	<div className={createClassName(styles, 'callTime')}>
		<time
			dateTime={new Date(props.stime).toISOString()}>
			<div>{I18n.t('Call started at ')}{parseDate(props.stime)}</div>
		</time>
	</div>
);


export const CallNotification = (props) => {
	const [isframe, setIframe] = useState(false);
	const [show, setShow] = useState(true);

	const acceptClick = async () => {
		setShow(!{ show });
		if (props.rid.t === 'jitsi_call_started') {
			const result = await Livechat.videoCall(props.rid);
			/* result:videoCall:
                    domain: "meet.jit.si"
                    provider: "jitsi"
                    rid: "uJiZ3P5nbG4XMdqJp"
                    room: "XLKhe6QE6dyRLtTkXuJiZ3P5nbG4XMdqJpRocketChat"
                    timeout: "2021-07-15T09:10:02.736Z"*/
			window.open(`https://${ result.videoCall.domain }/${ result.videoCall.room }`);
			return;
		}
		setIframe(true);
	};

	const declineClick = () => {
		setShow(false);
	};

	return (
		<div>
			{ show ? (<Screen.Content nopadding>
				<div className={createClassName(styles, 'notifyCall')}>
					<div className={createClassName(styles, 'avatar')}>
						<Avatar
							src={getAvatarUrl(props.rid.u.username)}
						/></div>
					{I18n.t('Incoming video Call')}
					<div className={createClassName(styles, 'button')}>
						<Button onClick={declineClick} className={createClassName(styles, 'declineButton')}> <PhoneDecline width={20} height={20} /> <span style='margin-left:5px'> {I18n.t('Decline')} </span> </Button>
						<Button onClick={acceptClick} className={createClassName(styles, 'acceptButton')} > <PhoneAccept width={20} height={20} /> <span style='margin-left:5px'> {I18n.t('Accept')} </span> </Button></div></div></Screen.Content>) : null}
			{isframe ? (<DisplayCallIframe session={props.rid.rid} />) : null }
		</div>);
};
