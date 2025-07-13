// Handles the popup modal for service slides
// Reusable for all service types

document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('service-popup-modal');
    const closeBtn = document.getElementById('service-popup-close');
    const gallery = document.getElementById('service-popup-gallery');
    const moreInfoButtons = document.querySelectorAll('.service-more-info-btn');
    const popupTitle = document.getElementById('service-popup-title');
    const popupDesc = document.getElementById('service-popup-desc');

    // Data for each service (extend as needed)
    const serviceData = {
        'luxury-accommodation': {
            title: 'LUXURY ACCOMMODATION',
            desc: `Experience the epitome of comfort and elegance in our luxury accommodations. Each room is meticulously designed with modern amenities, plush furnishings, and breathtaking views. Enjoy personalized service, state-of-the-art facilities, and a serene ambiance that ensures a memorable stay.`,
            galleryPath: 'assets/photos/luxury_accomodation/',
            galleryImages: [
                'luxury1.jpg.webp',
                'luxury2.jpg.webp',
                'luxury3.jpg.webp',
                'luxury4.jpg.webp'
            ]
        },
        // Add more services here
    };

    function openPopup(serviceKey) {
        const data = serviceData[serviceKey];
        if (!data) return;
        popupTitle.textContent = data.title;
        popupDesc.textContent = data.desc;
        // Clear gallery
        gallery.innerHTML = '';
        data.galleryImages.forEach(img => {
            const imgElem = document.createElement('img');
            imgElem.src = data.galleryPath + img;
            imgElem.alt = data.title + ' photo';
            imgElem.className = 'popup-gallery-img';
            gallery.appendChild(imgElem);
        });
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        closeBtn.focus();
    }

    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    moreInfoButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const service = btn.getAttribute('data-service');
            openPopup(service);
        });
    });

    closeBtn.addEventListener('click', closePopup);
    // Close on overlay click
    popup.addEventListener('click', function (e) {
        if (e.target === popup) closePopup();
    });
    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
});
