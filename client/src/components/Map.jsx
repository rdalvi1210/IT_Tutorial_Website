const AddressMap = () => {
  // Google Maps Embed URL with your address encoded
  const mapSrc =
    "https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Kaivalya+infotech,+shop+no+22,+opp+Dnyaneshwar+mangal+karyalay,+mahatma+phule+road,+dombivali+west";

  return (
    <div className="map-container" style={{ width: "100%", height: "400px" }}>
      <iframe
        title="Kaivalya Infotech Location"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default AddressMap;
