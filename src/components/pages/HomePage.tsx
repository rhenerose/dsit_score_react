import React, { useState, useCallback } from "react";
import './HomePage.css';
import Dropzone from "react-dropzone";
import { readString } from 'react-papaparse'
import { DataGrid, GridColDef } from '@material-ui/data-grid';

import GenericTemplate from "../templates/GenericTemplate";

function HomePage() {
    const [fileNames, setFileNames] = useState([]);

    // const [rows, setRows] = useState<[]>([]);
    // const [columns, setColumns] = useState<GridColDef[]>([]);
    const [gridValues, setGridValues] = useState({rows: [] as [], columns: [] as GridColDef[]});

    const handleDrop = useCallback((acceptedFiles: any) => {
        console.log(acceptedFiles);
        setFileNames(acceptedFiles.map((file: any) => file.path));
        if(acceptedFiles.length > 0)
        {
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
                    let rows: [] = [];
                    let columns: GridColDef[] = []
                    if (results.meta.fields)
                    {
                        console.log(results.data)
                        for (let id = 0; id < results.data.length; id++)
                        {
                            let item :any = results.data[id];
                            item["id"] = id;
                            rows.push(item as never);
                        }
                        results.meta.fields.forEach(col => {
                            let item :GridColDef = { field: col, headerName: col, sortable: false, editable: false};
                            columns.push(item as never);
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
                        <li key={fileName}>{fileName}</li>
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
        </GenericTemplate>
    );
};

export default HomePage;