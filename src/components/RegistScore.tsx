import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AlertDialog from "./AlertDialog";
import { useHistory } from "react-router-dom";

const RegistScore: React.FunctionComponent<{ score: any, email: any, endpoint: any }> = ({ score, email, endpoint }) => {

    const history = useHistory();

    const [resultDlg, setResultDlg] = React.useState<boolean>(false)
    const [dialogValues, setDialogValues] = React.useState({ title: "", msg: "" });

    function handleEmailFieldChange(e: any) {
        email = e.target.value;
    };

    function uploadSuccess(response: any) {
        console.log('Success:', response);

        if (response['success'] === true) {
            setDialogValues({ ...dialogValues, title: "Score登録", msg: `登録に成功しました。` });
            setResultDlg(true);
            history.push("/ranks", {"email": email});
        }
        else {
            setDialogValues({ ...dialogValues, title: "Error", msg: response.message });
            setResultDlg(true);
        }
    }

    async function doRegist() {
        if (!email) {
            alert("E-Mail Addressを入力してください。");
            return;
        }
        const formData = new FormData();
        formData.set('action', "reg");
        formData.set('email', email);
        formData.set('score', score);

        await fetch(endpoint, { method: 'POST', body: formData })
            .then(response => {
                if (response.ok) {
                    response.json().then(response => uploadSuccess(response))
                } else {
                    throw new Error(`Status ${response.status} response`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
            })
            ;

    };

    return (
        <>
            <p>score: {score}</p>
            <TextField
                required
                id="e-mail"
                label="E-Mail Address"
                defaultValue={email}
                variant="filled"
                onChange={(e) => handleEmailFieldChange(e)}
            />
            <Button onClick={() => doRegist()} disabled={score <= 0.0}>
                登録
            </Button>
            <AlertDialog
                title={dialogValues.title}
                msg={dialogValues.msg}
                isOpen={resultDlg}
                doButton1={() => { setResultDlg(false) }}
            />
        </>
    );
}

export default RegistScore;
