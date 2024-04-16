import { NavLink, json, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { useCallback, useEffect, useState } from 'react';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { getCategoryList } from '../_app.categories/route';
import { LeftArrow } from '~/components/icons/left';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
    await isAuthenticate(context);
    const categories = await getCategoryList(context);

    const mainCategorySlug = params?.mainCategorySlug;
    const categorySlug = params?.categorySlug;
    const subCategorySlug = params?.subCategorySlug;
    return json({ mainCategorySlug, categorySlug, subCategorySlug, categories });
}

const linkStyles =
    'text-center basis-full border-b-2 inline-block duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

const route = () => {
    const { mainCategorySlug, categorySlug, subCategorySlug, categories } =
        useLoaderData<typeof loader>();
    const backTitle = subCategorySlug
        ? subCategorySlug?.split('-').join(' ')
        : categorySlug?.split('-').join(' ');

    const matchingCategory = categories
        .map((category) => {
            const matchingSubcategory = category.child_categories.find(
                (subCategory) => subCategory.identifier === categorySlug,
            );
            return matchingSubcategory
                ? { ...category, subCategory: [matchingSubcategory] }
                : null;
        })
        .filter((category) => category !== null)[0];
    console.log('matchingCategory', matchingCategory);

    // For carousel at the top
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        containScroll: 'trimSnaps',
    });
    const scrollPrev = useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi],
    );
    const scrollNext = useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi],
    );
    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);
    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);
    useEffect(() => {
        if (!emblaApi) return;
        const activeTab = document.querySelector('.active__tab');
        const dataIndex = activeTab?.getAttribute('data-index');
        emblaApi.scrollTo(Number(dataIndex) || 0);
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    return (
        <section className="container">
            <div className="flex flex-wrap justify-between pt-6">
                <div>
                    <BackButton className="capitalize" title={backTitle ?? 'back'} />
                    <Breadcrumb>
                        <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
                            {mainCategorySlug?.split('-').join(' ')}
                        </BreadcrumbItem>
                        <BreadcrumbItem
                            href={subCategorySlug ? Routes.CATEGORIES : '#'}
                            className={`capitalize ${!subCategorySlug && 'text-grey-800 pointer-events-none'
                                }`}
                        >
                            {categorySlug?.split('-').join(' ')}
                        </BreadcrumbItem>
                        {subCategorySlug && (
                            <BreadcrumbItem className="capitalize text-grey-800">
                                {subCategorySlug?.split('-').join(' ')}
                            </BreadcrumbItem>
                        )}
                    </Breadcrumb>
                </div>
                <div>
                    <Button>upload order</Button>
                </div>
            </div>
            <Separator className="my-2" />
            <div className="sticky top-0 z-10 bg-primary-25">
                <div className="embla">
                    <div className="overflow-x-hidden embla__viewport" ref={emblaRef}>
                        <div className="flex gap-3 py-4 embla__container">
                            {subCategorySlug
                                ? matchingCategory?.subCategory.map((subCategory) =>
                                    subCategory.child_categories.map((childCategory, index) => (
                                        <div
                                            className="max-w-full min-w-0 flex-autoCustom embla__slide"
                                            key={childCategory.id}
                                        >
                                            <NavLink
                                                to={`/categories/${matchingCategory.identifier}/${subCategory?.identifier}/${childCategory?.identifier}`}
                                                data-index={index}
                                                className={({ isActive, isPending }) =>
                                                    isPending
                                                        ? `active__tab ${linkStyles}`
                                                        : isActive
                                                            ? `active__tab ${linkStyles}`
                                                            : linkStyles
                                                }
                                            >
                                                {childCategory.title}
                                            </NavLink>
                                        </div>
                                    )),
                                )
                                : matchingCategory?.child_categories
                                    .filter(
                                        (subCategory) =>
                                            subCategory.child_categories.length === 0,
                                    )
                                    .map((subCategory, index: number) => (
                                        <div
                                            className="max-w-full min-w-0 flex-autoCustom embla__slide"
                                            key={subCategory.id}
                                        >
                                            <NavLink
                                                to={`/categories/${matchingCategory.identifier}/${subCategory?.identifier}`}
                                                data-index={index}
                                                className={({ isActive, isPending }) =>
                                                    isPending
                                                        ? `active__tab ${linkStyles}`
                                                        : isActive
                                                            ? `active__tab ${linkStyles}`
                                                            : linkStyles
                                                }
                                            >
                                                {subCategory.title}
                                            </NavLink>
                                        </div>
                                    ))}
                        </div>
                    </div>
                    <button
                        className={`absolute z-10 flex items-center justify-center w-6 h-auto -translate-y-1/2 cursor-pointer -left-3 embla__button embla__next aspect-square top-1/2 bg-white shadow-md ${prevBtnDisabled ? 'hidden' : 'flex'
                            }`}
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                    >
                        <LeftArrow height={10} fill="#000" />
                    </button>
                    <button
                        className={`absolute z-10 items-center justify-center w-6 h-auto rotate-180 -translate-y-1/2 cursor-pointer -right-3 embla__button embla__prev aspect-square top-1/2 bg-white shadow-md ${nextBtnDisabled ? 'hidden' : 'flex'
                            }`}
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                    >
                        <LeftArrow height={10} fill="#000" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                <div className="xl:col-span-1">
                    <div className="sticky top-[100px] bg-neutral-white">
                        hello filter
                    </div>
                </div>
                <div className="xl:col-start-2 xl:col-end-5">hello right</div>
            </div>
        </section>
    );
};

export default route;