import html2canvas from 'html2canvas';
import { useState } from 'react';
import { ExportUp } from '~/components/icons/export';
import { Button } from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import { Can } from '~/lib/helpers/Can';

const PromotionNavigation = ({ canvasRef, imageName }: { canvasRef: any, imageName: string }) => {
  const [loading, setLoading] = useState(false);
  const canvasRefFinal = canvasRef.current;

  const printDocument = (canvasRefFinal: HTMLElement) => {
    setLoading(true);
    if (canvasRefFinal) {
      html2canvas(canvasRefFinal, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        removeContainer: true,
        width: canvasRefFinal.offsetWidth - 1,
        height: canvasRefFinal.offsetHeight - 1,
      }).then((canvas) => {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.download = `${imageName}.png`;
        link.href = canvas.toDataURL('image/jpeg', 0.8);
        link.target = '_blank';
        link.click();
        setLoading(false);
      });
    } else {
      alert('Error occured while exporting the image. Please try again.');
      setLoading(false);
    }
  };
  return (
    <Can I="view" a="export_promotions">

      <Button
        type="button"
        size="small"
        variant="ghost"
        className={`border-primary-500 hover:bg-inherit ${loading && 'pointer-events-none'
          }`}
        onClick={() => printDocument(canvasRefFinal)}
      >
        {loading ? <Loader /> : <ExportUp />}Export
      </Button>
    </Can>
  );
};

export default PromotionNavigation;
