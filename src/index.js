import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';
//import chartIcon from '@plone/volto/icons/world.svg';
import TopicsView from '@eeacms/volto-energy-theme/components/theme/View/TopicsView';
import TopicsTabView from '@eeacms/volto-energy-theme/components/theme/View/TopicsTabView';
import TopicsTabParentView from '@eeacms/volto-energy-theme/components/theme/View/TopicsTabParentView';
import ListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/ListTemplate';
import MetaFieldWidget from '@eeacms/volto-energy-theme/components/manage/Widgets/MetaField';
import GridListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/GridTemplate';
import CollectionView from '@eeacms/volto-energy-theme/components/theme/View/CollectionView';
import reducers from '@eeacms/volto-energy-theme/reducers';
// import FolderListingBlockView from 'volto-addons/FolderListing/BlockView';
// import FolderListingBlockEdit from 'volto-addons/FolderListing/BlockEdit';

// import HiddenWidget from 'volto-addons/Widgets/Hidden';
// import CollectionYears from 'volto-addons/Widgets/CollectionYears';
// import PickObject from 'volto-addons/PickObject';
// import ObjectListWidget from 'volto-addons/Widgets/ObjectList';
// import AlignBlockWidget from 'volto-addons/Widgets/Align';
// import AttachedImageWidget from 'volto-addons/Widgets/AttachedImage';
// import TemplatingToolbarWidget from 'volto-addons/Widgets/TemplatingToolbar';

// import MapView from 'volto-addons/Map/View';

// import WebMapBlockView from 'volto-addons/WebMap/BlockView';
// import WebMapBlockEdit from 'volto-addons/WebMap/BlockEdit';

// import ConnectedMapView from 'volto-addons/ConnectedMap/BlockView';
// import ConnectedMapEdit from 'volto-addons/ConnectedMap/BlockEdit';

// import ConnectedControl from 'volto-addons/ConnectedControl/ConnectedControl';
// // import SearchEdit from 'volto-addons/SearchBlock/Edit';
// // import SearchView from 'volto-addons/SearchBlock/View';

// import TableEdit from 'volto-addons/TableBlock/Edit';
// import TableView from 'volto-addons/TableBlock/View';

// import * as remoteAddonReducers from 'volto-addons/reducers';

import '@plone/volto/config';

export default function applyConfig(config) {
  // Add here your project's configuration here by modifying `config` accordingly

  const allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'www.eea.europa.eu',
    'www.eionet.europa.eu',
    'land.copernicus.eu',
  ];

  config.settings = {
    ...config.settings,
    apiExpanders: [
      ...config.settings.apiExpanders,
      {
        match: '/',
        GET_CONTENT: [
          'breadcrumbs',
          'siblings',
          'navigation',
          'localnavigation',
        ],
      },
    ],
    navDepth: 4,
    allowed_cors_destinations,
    tableauVersion: '2.3.0',
    pdfWorkerSrc: '//www.eea.europa.eu/pdfjs/pdf.worker.min.js',
  };

  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      topics_view: TopicsView,
      topic_tab_view: TopicsTabView,
      topic_tab_view_parent: TopicsTabParentView, //grandparent view
      //listing_view: CollectionView,
    },
    contentTypesViews: {
      ...config.views.contentTypesViews,
      Collection: CollectionView,
    },
  };

  config.widgets = {
    ...config.widgets,
    vocabulary: {
      ...config.widgets.vocabulary,
      'energy.resource_type': TokenWidget,
      'energy.topics': TokenWidget,
    },
    id: {
      ...config.widgets.id,
      // collection_years: CollectionYears,
      // blocks: HiddenWidget,
      // blocks_layout: HiddenWidget,
      // templatingtoolbar: TemplatingToolbarWidget,
    },
    widget: {
      ...config.widgets.widget,
      vocab_select: MetaFieldWidget,
      // sidebar: [TemplatingToolbarWidget],
      // object_by_path: PickObject,
      // objectlist: ObjectListWidget,
      // align: AlignBlockWidget,
      // attachedimage: AttachedImageWidget,
    },
  };

  config.blocks.blocksConfig.listing = {
    ...config.blocks.blocksConfig.listing,
    showLinkMore: true,
    variations: [
      ...config.blocks.blocksConfig.listing.variations,
      {
        id: 'grid',
        isDefault: false,
        title: 'Grid',
        template: GridListingBlockTemplate,
      },
      {
        id: 'list',
        isDefault: false,
        title: 'List',
        template: ListingBlockTemplate,
        schemaEnhancer: ({ formData, schema, intl }) => {
          schema.properties.metadata_fields = {
            title: 'Metadata field',
            widget: 'vocab_select',
            vocabulary: { '@id': 'plone.app.vocabularies.MetadataFields' },
          };
          schema.fieldsets[0].fields.push('metadata_fields');
          return schema;
        },
      },
    ],
  };

  // config.blocks.blocksConfig.folder_contents_block = {
  //   id: 'folder_contents_block',
  //   title: 'Folder Contents',
  //   view: FolderListingBlockView,
  //   edit: FolderListingBlockEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };

  //Custom Search block
  // blocks.blocksConfig.search_block = {
  //   id: 'search_block',
  //   title: 'Search block',
  //   view: SearchView,
  //   edit: SearchEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };

  // config.blocks.blocksConfig.table_block = {
  //   id: 'table_block',
  //   title: 'Table block',
  //   view: TableView,
  //   edit: TableEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };
  // config.blocks.blocksConfig.connected_map = {
  //   id: 'connected_map',
  //   title: 'Connected Map',
  //   view: ConnectedMapView,
  //   edit: ConnectedMapEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };

  // config.blocks.blocksConfig.connected_control = {
  //   id: 'connected_control',
  //   title: 'Connected Control',
  //   view: ConnectedControl,
  //   edit: ConnectedControl,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };

  // config.blocks.blocksConfig.web_map = {
  //   id: 'web_map',
  //   title: 'Web Map',
  //   view: WebMapBlockView,
  //   edit: WebMapBlockEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  //   sidebarTab: 1,
  // };

  config.addonRoutes = [...config.addonRoutes];
  config.addonReducers = {
    ...config.addonReducers,
    ...reducers,
  };
  return config;
}
