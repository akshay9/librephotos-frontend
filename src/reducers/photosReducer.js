import {
  FETCH_PERSON_PHOTOS_FULFILLED,
  FETCH_PERSON_PHOTOS_REJECTED,
  FETCH_USER_ALBUM_FULFILLED,
  FETCH_USER_ALBUM_REJECTED,
} from "../actions/albumsActions";
import {
  FETCH_PHOTOSET,
  FETCH_PHOTOSET_FULFILLED,
  FETCH_PHOTOSET_REJECTED,
  FETCH_RECENTLY_ADDED_PHOTOS,
  FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED,
  FETCH_RECENTLY_ADDED_PHOTOS_REJECTED,
  SET_PHOTOS_FAVORITE_FULFILLED,
} from "../actions/photosActions";
import {
  SEARCH_PHOTOS_FULFILLED,
  SEARCH_PHOTOS_REJECTED,
} from "../actions/searchActions";

export const Photoset = {
  NONE: "none",
  TIMESTAMP: "timestamp",
  NO_TIMESTAMP: "noTimestamp",
  FAVORITES: "favorites",
  HIDDEN: "hidden",
  RECENTLY_ADDED: "recentlyAdded",
  SEARCH: "search",
  USER_ALBUM: "userAlbum",
  PERSON: "person",
  SHARED_TO_ME: "sharedToMe",
  SHARED_BY_ME: "sharedByMe",
};

function resetPhotos(state, payload) {
  return {
    ...state,
    photosFlat: [],
    fetchedPhotoset: Photoset.NONE,
    photosGroupedByDate: [],
    photosGroupedByUser: [],
    error: payload,
  };
}

export default function reducer(
  state = {
    scanningPhotos: false,
    scannedPhotos: false,
    error: null,

    photoDetails: {},
    fetchingPhotoDetail: false,
    fetchedPhotoDetail: false,

    photos: {},
    fetchedPhotos: false,
    fetchingPhotos: false,

    photosFlat: [],
    photosGroupedByDate: [],
    photosGroupedByUser: [],
    fetchedPhotoset: Photoset.NONE,

    photosSharedFromMe: [],
    fetchingPhotosSharedFromMe: false,
    fetchedPhotosSharedFromMe: false,

    recentlyAddedPhotosDate: undefined,

    generatingCaptionIm2txt: false,
    generatedCaptionIm2txt: false,
  },
  action
) {
  var updatedPhotoDetails;
  var newPhotosFlat;
  var newPhotosGroupedByDate;

  switch (action.type) {
    case "GENERATE_PHOTO_CAPTION": {
      return { ...state, generatingCaptionIm2txt: true };
    }

    case "GENERATE_PHOTO_CAPTION_FULFILLED": {
      return {
        ...state,
        generatingCaptionIm2txt: false,
        generatedCaptionIm2txt: true,
      };
    }

    case "GENERATE_PHOTO_CAPTION_REJECTED": {
      return {
        ...state,
        generatingCaptionIm2txt: false,
        generatedCaptionIm2txt: false,
      };
    }

    case FETCH_RECENTLY_ADDED_PHOTOS: {
      return { ...state, fetchedPhotoset: Photoset.NONE };
    }
    case FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED: {
      return {
        ...state,
        photosFlat: action.payload.photosFlat,
        fetchedPhotoset: Photoset.RECENTLY_ADDED,
        recentlyAddedPhotosDate: action.payload.date,
      };
    }
    case FETCH_RECENTLY_ADDED_PHOTOS_REJECTED: {
      return resetPhotos(state, action.payload);
    }

    case "FETCH_PHOTOS_SHARED_FROM_ME": {
      return { ...state, fetchingPhotosSharedFromMe: true };
    }
    case "FETCH_PHOTOS_SHARED_FROM_ME_FULFILLED": {
      return {
        ...state,
        fetchingPhotosSharedFromMe: false,
        fetchedPhotosSharedFromMe: true,
        photosSharedFromMe: action.payload,
      };
    }
    case "FETCH_PHOTOS_SHARED_FROM_ME_REJECTED": {
      return {
        ...state,
        fetchingPhotosSharedFromMe: false,
        fetchedPhotosSharedFromMe: false,
      };
    }
    case "SCAN_PHOTOS": {
      return { ...state, scanningPhotos: true };
    }
    case "SCAN_PHOTOS_REJECTED": {
      return { ...state, scanningPhotos: false, error: action.payload };
    }
    case "SCAN_PHOTOS_FULFILLED": {
      return {
        ...state,
        scanningPhotos: false,
        scannedPhotos: true,
      };
    }

    case "FETCH_PHOTOS": {
      return { ...state, fetchingPhotos: true };
    }
    case "FETCH_PHOTOS_REJECTED": {
      return { ...state, fetchingPhotos: false, error: action.payload };
    }
    case "FETCH_PHOTOS_FULFILLED": {
      return {
        ...state,
        fetchingPhotos: false,
        fetchedPhotos: true,
        photos: action.payload,
      };
    }

    case FETCH_PHOTOSET: {
      return { ...state, fetchedPhotoset: Photoset.NONE };
    }
    case FETCH_PHOTOSET_FULFILLED: {
      return {
        ...state,
        photosFlat: action.payload.photosFlat,
        fetchedPhotoset: action.payload.photoset,
        photosGroupedByDate: action.payload.photosGroupedByDate ? action.payload.photosGroupedByDate : [],
        photosGroupedByUser: action.payload.photosGroupedByUser ? action.payload.photosGroupedByUser : [],
      };
    }
    case FETCH_PHOTOSET_REJECTED: {
      return resetPhotos(state, action.payload);
    }

    case "FETCH_PHOTO_DETAIL": {
      return {
        ...state,
        fetchingPhotoDetail: true,
      };
    }
    case "FETCH_PHOTO_DETAIL_FULFILLED": {
      var newPhotoDetails = { ...state.photoDetails };
      newPhotoDetails[action.payload.image_hash] = action.payload;
      return {
        ...state,
        fetchingPhotoDetail: false,
        fetchedPhotoDetail: true,
        photoDetails: newPhotoDetails,
      };
    }
    case "FETCH_PHOTO_DETAIL_REJECTED": {
      return { ...state, fetchingPhotoDetail: false, error: action.payload };
    }

    case "SET_PHOTOS_PUBLIC_FULFILLED": {
      updatedPhotoDetails = action.payload.updatedPhotos;
      newPhotoDetails = { ...state.photoDetails };

      updatedPhotoDetails.forEach((photoDetails) => {
        newPhotoDetails[photoDetails.image_hash] = photoDetails;
      });

      return {
        ...state,
        photoDetails: newPhotoDetails,
      };
    }

    case SET_PHOTOS_FAVORITE_FULFILLED: {
      updatedPhotoDetails = action.payload.updatedPhotos;
      newPhotoDetails = { ...state.photoDetails };
      newPhotosGroupedByDate = [...state.photosGroupedByDate];
      newPhotosFlat = [...state.photosFlat];

      updatedPhotoDetails.forEach((photoDetails) => {
        newPhotoDetails[photoDetails.image_hash] = photoDetails;

        newPhotosFlat = newPhotosFlat.map((photo) =>
          photo.id === photoDetails.image_hash
            ? { ...photo, rating: photoDetails.rating }
            : photo
        );
        newPhotosGroupedByDate = newPhotosGroupedByDate.map((group) =>
          // Create a new group object if the photo exists in its items (don't mutate).
          group.items.findIndex((photo) => photo.id === photoDetails.image_hash) === -1
            ? group
            : {
                ...group,
                items: group.items.map((item) =>
                  item.id !== photoDetails.image_hash
                    ? item
                    : {
                        ...item,
                        rating: photoDetails.rating,
                      }
                ),
              }
        );

        if (
          state.fetchedPhotoset === Photoset.FAVORITES &&
          !action.payload.favorite
        ) {
          // Remove the photo from the photo set. (Ok to mutate, since we've already created a new group.)
          newPhotosGroupedByDate.forEach(
            (group) =>
              (group.items = group.items.filter(
                (item) => item.id !== photoDetails.image_hash
              ))
          );
          newPhotosFlat = newPhotosFlat.filter(
            (item) => item.id !== photoDetails.image_hash
          );
        }
      });

      // Keep only groups that still contain photos
      newPhotosGroupedByDate = newPhotosGroupedByDate.filter(
        (group) => group.items.length > 0
      );

      return {
        ...state,
        photoDetails: newPhotoDetails,
        photosFlat: newPhotosFlat,
        photosGroupedByDate: newPhotosGroupedByDate,
      };
    }

    case "SET_PHOTOS_HIDDEN_FULFILLED": {
      updatedPhotoDetails = action.payload.updatedPhotos;
      newPhotoDetails = { ...state.photoDetails };

      updatedPhotoDetails.forEach((photoDetails) => {
        newPhotoDetails[photoDetails.image_hash] = photoDetails;
      });

      return {
        ...state,
        photoDetails: newPhotoDetails,
      };
    }

    case SEARCH_PHOTOS_FULFILLED: {
      return {
        ...state,
        photosFlat: action.payload.photosFlat,
        fetchedPhotoset: Photoset.SEARCH,
        photosGroupedByDate: action.payload.photosGroupedByDate,
      };
    }

    case SEARCH_PHOTOS_REJECTED: {
      return resetPhotos(state, action.payload);
    }

    case FETCH_USER_ALBUM_FULFILLED: {
      return {
        ...state,
        photosFlat: action.payload.photosFlat,
        fetchedPhotoset: Photoset.USER_ALBUM,
        photosGroupedByDate: action.payload.photosGroupedByDate,
      };
    }
    case FETCH_USER_ALBUM_REJECTED: {
      return resetPhotos(state, action.payload);
    }

    case FETCH_PERSON_PHOTOS_FULFILLED: {
      return {
        ...state,
        photosFlat: action.payload.photosFlat,
        fetchedPhotoset: Photoset.PERSON,
        photosGroupedByDate: action.payload.photosGroupedByDate,
      };
    }
    case FETCH_PERSON_PHOTOS_REJECTED: {
      return resetPhotos(state, action.payload);
    }

    default: {
      return { ...state };
    }
  }
}
