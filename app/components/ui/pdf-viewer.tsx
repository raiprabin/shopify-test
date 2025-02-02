import React, {useMemo} from 'react';
import {Document, Page} from 'react-pdf';
import {pdfjs} from 'react-pdf';
import {PDF} from '~/lib/constants/pdf.constent';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function PDFViewer({pdfURL}: {pdfURL: string}) {
  const [width, setWidth] = React.useState<number>();

  const options = useMemo(
    () => ({
      httpHeaders: {
        apiKey: PDF.SECRET_KEY,
      },
    }),
    [],
  );

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth * 0.95);
      }
    });

    resizeObserver.observe(pdfWrapperRef.current as unknown as Element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const pdfWrapperRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="center" ref={pdfWrapperRef}>
      <Document
        renderMode="canvas"
        loading={<Loading />}
        error={<Error />}
        file={pdfURL}
        options={options}
      >
        <Page pageNumber={1} width={width || undefined} />
      </Document>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-72">
      <div className="rounded-full w-7 h-7 border-4 border-primary-300 border-solid border-l-primary-500 animate-spin"></div>
    </div>
  );
}

function Error() {
  return (
    <div className="flex items-center justify-center h-72">
      <div className="text-semantic-danger-500 font-semibold text-xl">
        Opps, Failed to load the PDF
      </div>
    </div>
  );
}
