import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { InfoAlert } from '~/components/icons/alert';
import { CSVIcon, CSVIconSmall } from '~/components/icons/csv-icon';
import { Delete } from '~/components/icons/delete';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { CircularProgressBar } from '~/components/ui/circular-progress-bar';
import { ConfirmDeleteModal } from '~/components/ui/confirm-delete-modal';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import FullPageLoading from '~/components/ui/fullPageLoading';
import { Separator } from '~/components/ui/separator';
import { displayToast } from '~/components/ui/toast';
import { CSV_LIMIT, CSV_ROWS } from '~/lib/constants/general.constant';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPE = {
    'text/csv': [],
    'application/vnd.ms-excel': [],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
};

export type CSVFileType = {
    stockCode: string;
    uom: string;
    quantity: string;
};

export const UploadCsvFile = ({
    setCsvToArray,
    btnSecondary
}: {
    setCsvToArray?: React.Dispatch<React.SetStateAction<CSVFileType[]>>;
    btnSecondary?: boolean;
}) => {
    const [isProgressBarShow, setIsProgressBarShow] = useState(false);
    const [file, setFile] = useState<string | null>(null);
    const [csvArray, setCsvArray] = useState<CSVFileType[]>([]);
    const [dialogState, setDialogState] = useState({
        isUploadCSVDialogOpen: false,
        isConfirmDialogOpen: false,
    });

    const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
        useDropzone({
            accept: {
                ...ACCEPTED_FILE_TYPE,
            },
            maxSize: MAX_FILE_SIZE,
            multiple: false,
            onDropAccepted: () => setIsProgressBarShow(true),
        });

    const rejectionErrorMessage = fileRejections.map(({ errors }) => {
        return errors.map((error) => error.message)[0];
    })[0];

    const handleCancel = () => {
        setIsProgressBarShow(false);
        setFile(null);
    };

    const handleDelete = () => {
        setDialogState((previousState) => ({
            ...previousState,
            isUploadCSVDialogOpen: false,
        }));
        setDialogState((previousState) => ({
            ...previousState,
            isConfirmDialogOpen: true,
        }));
    };

    /**
     *
     * @param csvString
     * @description converts the csv file to array of objects
     */
    const csvFileToArray = (csvString: string): void => {
        const csvHeader = csvString.slice(0, csvString.indexOf('\n')).split(',');
        const csvRows = csvString.slice(csvString.indexOf('\n') + 1).split('\n');

        const newArray = csvRows.map((i) => {
            const values = i.split(',');
            const obj = csvHeader.reduce((object, header, index) => {
                // @ts-ignore
                object[header] = values[index];
                return object;
            }, {} as CSVFileType);
            return obj;
        });

        // Additional validatiion goes here if required

        setCsvArray(newArray);
    };

    useEffect(() => {
        const fileReader = new FileReader();

        const acceptedFile = acceptedFiles[0];

        if (acceptedFile) {
            setFile(acceptedFile.name);
            fileReader.onload = function (event) {
                if (event.target?.result) {
                    const csvString = event.target.result as string;
                    csvFileToArray(csvString);
                }
            };

            fileReader.readAsText(acceptedFile);
        }
    }, [acceptedFiles]);

    const fetcher = useFetcher();

    return (
        <>
            {fetcher.state != "idle" && (
                <FullPageLoading description='The CSV uploaded is being added to cart. Please wait for few moments....' />
            )}
            <Button
                variant="primary"
                className={`${btnSecondary && "bg-secondary-500 py-4 px-8 font-bold italic leading-6 text-lg text-grey-800 md:min-w-[193px] max-h-14 hover:bg-grey-800 hover:text-white"}`}
                onClick={() =>
                    setDialogState((previousState) => ({
                        ...previousState,
                        isUploadCSVDialogOpen: true,
                    }))
                }
            >
                Upload Order
            </Button>

            {/* Upload CSV Modal */}
            <Dialog
                open={dialogState.isUploadCSVDialogOpen}
                onOpenChange={() =>
                    setDialogState((previousState) => ({
                        ...previousState,
                        isUploadCSVDialogOpen: false,
                    }))
                }
            >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[620px]">
                    <DialogHeader>
                        <DialogTitle>Upload CSV</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    {!isProgressBarShow && (
                        <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3'>
                            <InfoAlert />
                            <AlertDescription className="text-base !translate-y-0 !pl-6 flex justify-between items-center">
                                Ensure submissions match the sample file format.{' '}
                                <a href="/data/example.csv" download>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="small"
                                        className="px-0"
                                        onClick={() =>
                                            displayToast({
                                                message: 'Downloading sample file',
                                                type: 'success',
                                            })
                                        }
                                    >
                                        download a sample file
                                    </Button>
                                </a>
                            </AlertDescription>
                        </Alert>
                    )}
                    {isProgressBarShow ? (
                        <div className="flex items-center justify-center px-3 py-10">
                            <div className="">
                                <CircularProgressBar
                                    setIsProgressBarShow={setIsProgressBarShow}
                                />
                                <p className="text-grey-900">Uploading file...</p>
                                <Button type="button" variant="link" onClick={handleCancel}>
                                    cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <section className="border border-dashed border-grey-300">
                                <div {...getRootProps()} className="px-3 py-10">
                                    <input {...getInputProps()} accept="" />
                                    <div className="text-center">
                                        <span className="flex items-center justify-center mb-4">
                                            <CSVIcon />
                                        </span>
                                        <p className="text-grey-900 text-lg leading-5.5">
                                            <span className="font-medium text-primary-500">
                                                Select
                                            </span>{' '}
                                            a CSV file to upload{' '}
                                        </p>
                                        <p className="text-grey-500">or drag and drop it here</p>
                                        <p className="text-red-500">{rejectionErrorMessage}</p>
                                    </div>
                                </div>
                            </section>
                            {typeof file === 'string' && (
                                <div className="flex items-center justify-between px-4 py-3 bg-primary-25">
                                    <div className="flex items-center space-x-2">
                                        <CSVIconSmall />
                                        <p className="text-lg leading-5.5 text-grey-900">{file}</p>
                                    </div>
                                    <button type="button" onClick={handleDelete}>
                                        <Delete />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="uppercase" variant="ghost">
                                discard
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isProgressBarShow}
                            onClick={() => {
                                setCsvToArray && setCsvToArray(csvArray);
                                if (csvArray.length > CSV_LIMIT) {
                                    displayToast({ message: "The CSV uploaded is too large", type: "error", messageCase: "normal" });
                                    return;
                                }
                                const requiredKeys = [CSV_ROWS.STOCKCODE, CSV_ROWS.UOM, CSV_ROWS.QUANTITY];
                                const missingKeys = requiredKeys.filter(key => {
                                    // const finalKey = key.toLowerCase().trim();
                                    // return !csvArray.some(obj => Object.keys(obj).some(objKey => objKey.toLowerCase().trim() === finalKey));
                                    return !csvArray.some(obj => Object.keys(obj).some(objKey => objKey === key));
                                });
                                if (missingKeys.length > 0) {
                                    console.log("Error: Missing keys - " + missingKeys.join(', '));
                                    displayToast({ message: `CSV format issue, missing: ${missingKeys.join(', ')}`, type: "error", messageCase: "normal" });
                                    return;
                                } else {
                                    console.log("All required keys are present.");
                                    let hasEmptyStockCode = false;
                                    csvArray.forEach(item => {
                                        if (item.stockCode === "") {
                                            hasEmptyStockCode = true;
                                        }
                                    });
                                    if (hasEmptyStockCode) {
                                        displayToast({ message: "StockCode is empty in some row. Please check the CSV before uploading.", type: "error", messageCase: "normal" });
                                        return;
                                    }
                                    else {
                                        console.log("csvArray", csvArray);
                                        fetcher.submit(
                                            //@ts-ignore
                                            csvArray,
                                            { method: 'POST', encType: 'application/json' }
                                        );
                                        setDialogState((previousState) => ({
                                            ...previousState,
                                            isUploadCSVDialogOpen: false,
                                        }));
                                    }
                                }
                            }}
                        >
                            Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isConfirmDialogOpen={dialogState.isConfirmDialogOpen}
                setDialogState={setDialogState}
                setFile={setFile}
            />
        </>
    );
};
