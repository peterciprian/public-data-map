import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import ImageWMS from 'ol/source/ImageWMS';

export const BaseLayersConfig = {
    'osm-default': new TileLayer({
        source: new OSM(),
        visible: true,
        properties: { name: 'OSM Default' }
    }),
    'osm-satellite': new TileLayer({
        source: new XYZ({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attributions: '© OpenTopoMap (CC-BY-SA)'
        }),
        visible: false,
        properties: { name: 'OSM Satellite' }
    }),
    'osm-humanitarian': new TileLayer({
        source: new XYZ({
            url: 'https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attributions: '© OpenStreetMap contributors, Humanitarian style'
        }),
        visible: false,
        properties: { name: 'OSM Humanitarian' }
    }),
    'esri-world_Imagery': new TileLayer({
        source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © Esri'
        }),
        properties: { name: 'World Imagery' },
        visible: false
    })
};

export const OverlayLayersConfig = {
    'turistautak': new ImageLayer({
        source: new ImageWMS({
            url: 'https://gis.turistaterkepek.hu/server/services/turistaut_nyilvantartas/nyilvantartas_wms/MapServer/WMSServer',
            params: { LAYERS: '0' },
            attributions: 'Turistautak.hu'
        }),
        visible: false,
        properties: { name: 'Turistautak' }
    })
};
