<script setup lang="ts">
import Swiper from 'swiper/bundle';
//import { Swiper as SwiperElement, SwiperSlide } from 'swiper/vue';
//import type { Swiper } from 'swiper/types';
import { replaceMediaUrls } from '~/utils/replaceMediaUrls';
import type { UmbracoGridElementContent, UmbracoImage, UmbracoLink } from '~/types/umbraco.types';
import type { UmbracoCategoryModuleCardItem } from '~/types/umbraco-category-cards-module.types';

import 'swiper/css';

interface CategoryCardsModuleProps { data: UmbracoGridElementContent; }
const props = defineProps<CategoryCardsModuleProps>();
const categoryCardsItems = computed(() => mapCategoryCardsItems(props.data));
const mapCategoryCardsItems = (data: UmbracoGridElementContent): UmbracoCategoryModuleCardItem[] => {
    const rawItems = data?.properties?.categoryCardsItems?.items || [];
    const mappedItems: UmbracoCategoryModuleCardItem[] = rawItems.map((item: any) => {
        const prop = item?.content?.properties;
        if (prop) {
            let link: UmbracoLink | undefined;
            if (Array.isArray(prop.link) && prop.link.length > 0) {
                link = prop.link.find((lk: UmbracoLink) => lk && lk.url || lk.route?.path)
            }
            let categoryCardsItemImage: UmbracoImage | undefined;
            if (Array.isArray(prop.categoryCardsItemImage) && prop.categoryCardsItemImage.length > 0) {
                categoryCardsItemImage = prop.categoryCardsItemImage.find((image: UmbracoImage) => image && image.url)
            }
            return {
                categoryCardsItemItemSize: prop.categoryCardsItemItemSize || "Large",
                categoryCardsItemTitle: prop.categoryCardsItemTitle || "",
                categoryCardsItemSubtitle: prop.categoryCardsItemSubtitle || null,
                categoryCardsItemImage, link,
            };
        }
    });
    return mappedItems.filter(item => item);
}

const config = useRuntimeConfig();
const apiGatewayUrl = (config.apiGatewayUrl || config.public.apiGatewayUrl) as string;
const getImageUrl = (image: UmbracoImage | undefined) => image && image.url ? replaceMediaUrls(image.url, apiGatewayUrl) : '';

const catCardBGOverlay = '#000C23'
const catCardWidthDefault: Record<string, string> = {
    '--category-card-bg-overlay': catCardBGOverlay,
    '--category-card-width-Large': '370px',
    '--category-card-width-Small': '240px',
}
const themeStyle = ref(catCardWidthDefault);

const catCardSwiperRef = ref<HTMLElement | null>(null);

function resizeWidthSlideItem() {
    const width = window.innerWidth;
    if (width < 481) {
        const slideWidth = width - 80;
        themeStyle.value['--category-card-width-Large'] = `${slideWidth}px`;
        themeStyle.value['--category-card-width-Small'] = `${slideWidth}px`;
        console.log(`mobile =`, slideWidth);
        if (catCardSwiperRef.value) {
            catCardSwiperRef.value.style.setProperty('--category-card-width-Large', `${slideWidth}px`);
            catCardSwiperRef.value.style.setProperty('--category-card-width-Small', `${slideWidth}px`);
        }
    } else if (width > 480 && width < 1024) {
        const slideWidthLarge = parseInt(width / 3) - 10;
        const slideWidthSmall = slideWidthLarge - 50;
        themeStyle.value = {
            '--category-card-bg-overlay': catCardBGOverlay,
            '--category-card-width-Large': `${slideWidthLarge}px`,
            '--category-card-width-Small': `${slideWidthSmall}px`,
        }
        console.log(`tablet =`, slideWidthLarge, slideWidthSmall);
        if (catCardSwiperRef.value) {
            catCardSwiperRef.value.style.setProperty('--category-card-width-Large', `${slideWidthLarge}px`);
            catCardSwiperRef.value.style.setProperty('--category-card-width-Small', `${slideWidthSmall}px`);
        }
    } else {
        themeStyle.value = catCardWidthDefault;
    }
}

//onBeforeMount(() => { resizeWidthSlideItem() })

onMounted(() => {
    //if (catCardModuleRef.value) { window.addEventListener('resize', () => resizeWidthSlideItem()); }
    resizeWidthSlideItem()
    initSwiper();
})

const initSwiper = () => {
    if (!catCardSwiperRef.value) return;

    var swiper = new Swiper(catCardSwiperRef.value, {
        spaceBetween: 10,
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },

        // GIẢI PHÁP CHỐNG LỆCH / KHOẢNG TRẮNG KHI DÙNG 'AUTO'
        slidesOffsetBefore: 0,   // Giữ lề trái slide đầu tiên sát mép khung
        slidesOffsetAfter: 0,    // Chặn không cho vuốt quá slide cuối cùng (loại bỏ khoảng trắng bên phải)

        breakpoints: {
            // Mobile
            0: {
                //slidesPerView: 1.1,
                slidesPerView: 'auto',
            },
            // Tablet: Hiển thị đúng 3 slide nguyên vẹn + 1 góc slide thứ 4 (tổng khoảng 3.3 slide)
            480: {
                //slidesPerView: 3.3,
                slidesPerView: 'auto',
            },
            // PC
            1024: {
                slidesPerView: 'auto',
            },
        },
    });
}

</script>

<template>
    <div ref="catCardSwiperRef" class="swiper mySwiper"
        style="--category-card-width-Large: 250px; --category-card-width-Small: 196px;">
        <div class="swiper-wrapper">
            <div class="swiper-slide Large">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Large)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/dw5h2rsg/domicil.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/runj310x/250809_mbymascot_london0015.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/ekzdzj4t/25416-644-12_25214-742-60_25037-644-12_a02.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/0nobq1m5/_dsc5656.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/5dij1zgy/25406-665-1288_25004-742-60_25837-665-1288_25050-288-1216_f3000-902-13_a01.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://app-mascotapigateway-prod.azurewebsites.net/cms-media/uofgsmbl/customized_banner_frontpage.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://mascotsitecore-1ccb8.kxcdn.com/42A2AC312C1047CEB564806713F96271.JPG"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://mascotsitecore-1ccb8.kxcdn.com/A3EA751CE51341959D36EA3349B2999F.JPG"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
            <div class="swiper-slide Small">
                <div class="h-115.75 relative inline-block bg-gray-500" style="width: var(--category-card-width-Small)">
                    <div class="absolute inset-0 z-0">
                        <img src="https://mascotsitecore-1ccb8.kxcdn.com/09C57CE5048A45EC8E7384BB91C3656A-en.jpg"
                            class="h-full w-full object-cover" decoding="async" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.swiper {
    width: 100%;
    height: 300px;
    margin-top: 10px;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100%;
    /* Tạo hiệu ứng co giãn mượt mà khi vuốt */
    transition: height 0.3s ease, transform 0.3s ease;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.swiper-slide.Large {
    width: var(--category-card-width-Large) !important;
}

.swiper-slide.Small {
    width: var(--category-card-width-Small) !important;
}

/* --- PC --- */
@media (min-width: 1024px) {
    .swiper-slide {
        /* width: calc(16.6% - 6px) !important; */
        height: 100% !important;
    }

    .swiper-slide:nth-child(5n + 1),
    .swiper-slide:nth-child(5n + 2) {
        /* width: calc(25% - 10px) !important; */
        display: inline-block;
    }
}

/* --- TABLET --- */
@media (min-width: 481px) and (max-width: 1023px) {

    /* Giữ tất cả slide có chiều cao đầy đủ */
    .swiper-slide {
        height: 100%;
    }

    /* Thu hẹp chiều cao của slide ở vị trí thứ 4.
               Trong Swiper, khi hiển thị 3 slide rưỡi thì slide thứ 4 
               chính là slide mang class .swiper-slide-next kết hợp thêm 2 cấp */
    .swiper-slide-next+.swiper-slide+.swiper-slide:not(.swiper-slide:last-of-type) {
        height: 85% !important;
        align-self: center;
    }

    .swiper-slide+.swiper-slide+.swiper-slide-prev {
        height: 85% !important;
        align-self: center;
    }

    .swiper-slide:last-of-type {
        margin-right: 0 !important;
    }
}

/* --- MOBILE --- */
@media (max-width: 480px) {

    /* Giữ tất cả slide có chiều cao đầy đủ */
    .swiper-slide {
        height: 100%;
    }

    /* Thu hẹp chiều cao của slide thứ 2 (chính là slide-next) đang bị lộ 0.1 ở phía bên phải */
    .swiper-slide-next {
        height: 85% !important;
        align-self: center;
    }

    /* 2. Khi ở slide cuối cùng: Thu nhỏ slide phía trước (phía bên trái) đang lộ 0.1 */
    .swiper-slide-prev {
        height: 85% !important;
        align-self: center;
    }
}
</style>

<style lang="css">
@reference "@/assets/css/tailwind.css";

.category-cards-module .category-cards-module-item {
    @apply sm:max-w-93.75;
}
</style>