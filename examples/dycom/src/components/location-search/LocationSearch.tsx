'use client';

import type React from 'react';
import type { LocationSearchProps } from './location-search.props';
import { LocationSearchNationwide } from './LocationSearchNationwide.dev';
import { LocationSearchDefault } from './LocationSearchDefault.dev';
import { LocationSearchMapRight } from './LocationSearchMapRight.dev';
import { LocationSearchMapTopAllCentered } from './LocationSearchMapTopAllCentered.dev';
import { LocationSearchMapRightTitleZipCentered } from './LocationSearchMapRightTitleZipCentered.dev';
import { LocationSearchTitleZipCentered } from './LocationSearchTitleZipCentered.dev';

/** Dycom nationwide companies map — datasource: Data/Locations folder. */
export const Default: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchNationwide {...props} isPageEditing={isPageEditing} />;
};

/** Legacy zip-code dealer locator (Google Maps). */
export const DealerLocator: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchDefault {...props} isPageEditing={isPageEditing} />;
};

export const MapRight: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapRight {...props} isPageEditing={isPageEditing} />;
};

export const MapTopAllCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapTopAllCentered {...props} isPageEditing={isPageEditing} />;
};

export const MapRightTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapRightTitleZipCentered {...props} isPageEditing={isPageEditing} />;
};

export const MapLeftTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchTitleZipCentered {...props} isPageEditing={isPageEditing} />;
};
