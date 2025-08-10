import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/swiper.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import slider01 from "../assets/images/slider/01.jpg"
import slider02 from "../assets/images/slider/02.jpg"
import slider03 from "../assets/images/slider/03.jpg"
import slider04 from "../assets/images/slider/04.jpg"

const SwiperComponent = () => {
    return (
        <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
        >
            <SwiperSlide><img src={slider01} alt="Slide 1" /></SwiperSlide>
            <SwiperSlide><img src={slider02} alt="Slide 2" /></SwiperSlide>
            <SwiperSlide><img src={slider03} alt="Slide 3" /></SwiperSlide>
            <SwiperSlide><img src={slider04} alt="Slide 4" /></SwiperSlide>
        </Swiper>
    )
}

export default SwiperComponent;