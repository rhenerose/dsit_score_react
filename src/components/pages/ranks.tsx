import React from "react";
import GenericTemplate from "../templates/GenericTemplate";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as colors from "@material-ui/core/colors";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    palette: {
        primary: {
            main: colors.blue[800],
        },
        type: "dark",
    },
    icon: {
        marginRight: theme.spacing(2),
    },

    rightToolbar: {
        marginLeft: "auto",
        marginRight: -12
    },
    menuButton: {
        marginRight: 16,
        marginLeft: -12
    },

    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

    tableContainer: {
        // maxWidth: 550,
        minWidth: 350,
    },
    table: {
        maxWidth: 500,
        minWidth: 300,
    },
    tableRow: {
        "&$selected, &$selected:hover": {
            backgroundColor: "purple"
        },
        "&$hover:hover": {
            backgroundColor: "blue"
        }
    },
    tableCell: {
        "$selected &": {
            color: "yellow"
        }
    }

}));

const RankPage: React.FC = () => {
    const location = useLocation<any>();
    const classes = useStyles();
    const [rows, setRows] = React.useState([] as any[]);
    const [isOpen, setIsOpen] = React.useState(false);
    const email = location.state ? (location.state.email ?? "") : "";

    function apiSuccess(response: any) {
        console.log('Success:', response);

        if (response['success'] === true) {
            setRows(response['message']);
        }
        else {
        }
    }

    const formData = new FormData();
    formData.set('action', "query");

    // const API_ENDPOINT = "http://localhost:7071/api/day7_r2_score";
    const API_ENDPOINT = "https://dsit-score.azurewebsites.net/api/day7_r2_score";

    async function doQuery() {
        await fetch(API_ENDPOINT, { method: 'POST', body: formData })
            .then(response => {
                if (response.ok) {
                    response.json().then(response => apiSuccess(response))
                } else {
                    throw new Error(`Status ${response.status} response`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsOpen(true)
            })
            ;
    }

    React.useEffect(() => {
        if (!isOpen) {
            doQuery();
        }
    }, [isOpen]);

    return (
        <GenericTemplate title="ランキング">
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ランク</TableCell>
                            <TableCell>ユーザ</TableCell>
                            <TableCell align="right">スコア</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow
                                className={classes.tableRow}
                                key={row.RowKey}
                                selected={email === row.RowKey}
                                hover
                            >
                                <TableCell align="left">{idx + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.RowKey}
                                </TableCell>
                                <TableCell align="right">{Number(row.score).toFixed(3)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* プログレスダイアログ */}
            <Backdrop className={classes.backdrop} open={!isOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </GenericTemplate>
    );
};

export default RankPage;