import React, { useState, useCallback } from "react";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './HomePage.css';
import Dropzone from "react-dropzone";
import { readString } from 'react-papaparse'
import { DataGrid, GridColDef } from '@material-ui/data-grid';

import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import DoneIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/HighlightOff';
import CircularProgress from '@material-ui/core/CircularProgress';


import GenericTemplate from "../templates/GenericTemplate";
import AlertDialog from "../AlertDialog";


type UploadAPI_JSON = {
    success: boolean;
    message: string;
    score: number;
}

type FileList = {
    name: string;
    blob: Blob;
}

function HomePage() {
    const [fileNames, setFileNames] = useState<FileList[]>([]);

    // const [rows, setRows] = useState<[]>([]);
    // const [columns, setColumns] = useState<GridColDef[]>([]);
    const [gridValues, setGridValues] = useState({rows: [] as any[], columns: [] as GridColDef[]});

    const [commitEnabled, setCommitEnabled] = useState<boolean>(false);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isStop, setIsStop] = useState<boolean>(false);

    const [resultDlg, setResultDlg] = useState<boolean>(false)
    const [dialogValues, setDialogValues] = useState({title: "", msg: ""});

    // アップロード成功ハンドラ
    function uploadSuccess(response: UploadAPI_JSON) {
        console.log('Success:', response);
        setCommitEnabled(false);    // 送信ボタン非活性

        // APIから返ってきたJSON
        const retJSON = JSON.stringify(response)
        console.log(retJSON);

        if (response['success'] === true) {
            setDialogValues({ ...dialogValues, title: "Score", msg: `データの送信が成功しました。\nScore: ${response.score.toFixed(3)}` });
            setResultDlg(true);
            setIsStop(false);
            setIsDone(true);
        }
        else {
            setDialogValues({ ...dialogValues, title: "Error", msg: response.message });
            setResultDlg(true);
            setIsStop(true);
            setIsDone(false);
        }

        // let imageTag = ""
        // let ret = allTags;
        // response['urls'].forEach(
        //     (element: string, index: number) => {
        //         const historys = history.slice()
        //         imageTag = `![](${element})`
        //         setHistory(
        //             historys.concat([{
        //             url: element,
        //             imageTag: imageTag,}
        //         ]));
        //         setResponseText(String(retJSON));

        //         ret += `${imageTag}\r`
        //     }
        // );

        // setAllTags(ret)
    }

    async function commit() {
        if (!commitEnabled) {return;}

        setCommitEnabled(false);    // 送信ボタン非活性

        // get blob from url
        // const blob = await fetch(fileNames[0]).then(r => r.blob());

        const formData = new FormData();
        formData.append('uploads', fileNames[0].blob, 'day7_submit.csv');

        // Call API
        setIsBusy(true);
        await fetch('http://localhost:7071/api/day7_r2_score', { method: 'POST', body: formData })
        .then(response => {
            if (response.ok) {
                response.json().then(response => uploadSuccess(response))
            } else {
                throw new Error(`Status ${response.status} response`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // setResponseText(String(error));
        })
        .finally(() => {
            setIsBusy(false);
        })
        ;

        return;
    }

    const SubmitButton = () => {
        const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            margin: {
                margin: theme.spacing(1),
            },
            extendedIcon: {
                marginRight: theme.spacing(1),
            },
            }),
        );
        const classes = useStyles();

        return(
            isDone ? <DoneIcon color='primary' />
            :
            isStop ? <ErrorIcon color='secondary' />
            :
            isBusy ?
                <CircularProgress size={20} />
            :
                <IconButton size="medium" color="secondary" onClick={() => commit()} disabled={!commitEnabled}  className={classes.margin}>
                    <BackupIcon fontSize="medium"/>
                </IconButton>
        )
    }


    const handleDrop = useCallback((acceptedFiles: any) => {
        console.log(acceptedFiles);
        setFileNames(acceptedFiles.map((file: any) => ({"name": file.path, "blob": file})));
        if(acceptedFiles.length > 0)
        {
            setIsDone(false);
            setIsStop(false);
            setCommitEnabled(true);

            const file = acceptedFiles[0];
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const bufferStr = reader.result
                if (bufferStr)
                {
                    const results = readString(bufferStr.toString(), {header: true})
                    const rows: any[] = [];
                    const columns: GridColDef[] = []
                    if (results.meta.fields)
                    {
                        console.log(results.data)
                        for (let id = 0; id < results.data.length; id++)
                        {
                            const item :any = results.data[id];
                            item["id"] = id;
                            rows.push(item);
                        }
                        results.meta.fields.forEach(col => {
                            const item :GridColDef = { field: col, headerName: col, sortable: false, editable: false};
                            columns.push(item);
                        })
                    }

                    if (results.data.length)
                    {
                        // setColumns(columns);
                        // setRows(rows);
                        setGridValues({ ...gridValues, rows: rows, columns: columns });
                    }
                    console.log(results)
                }
            }
            reader.readAsText(file)
        }
        else
        {
            console.log("No accepted files!!");
        }
    }, [gridValues])

    return (
        <GenericTemplate title="Submit">
            <Dropzone
                accept=".csv, text/csv"
                onDrop={handleDrop}
                multiple={false}
                maxSize={1024000}   // max 1MB
                >
                {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept,
                    isDragReject
                }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <span> 📁 </span>
                        <p>CSVファイルをドロップするか、クリックしてファイルを選択してください</p>
                    </div>
                )}
            </Dropzone>
            <hr/>
            <div>
                <strong>Files:</strong>
                <ul>
                    {fileNames.map(fileName => (
                        <li key={fileName.name}>{fileName.name} <SubmitButton /></li>
                    ))}
                </ul>
            </div>
            <hr/>
            <h1>
                DataPreview
            </h1>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={gridValues.rows} columns={gridValues.columns} pageSize={50} />
            </div>
            <>
                <AlertDialog
                    title={dialogValues.title}
                    msg={dialogValues.msg}
                    isOpen={resultDlg}
                    doButton1={() => {setResultDlg(false)}}
                />
            </>
        </GenericTemplate>
    );
};

export default HomePage;