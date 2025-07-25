<template>
  <div class="relative h-screen bg-gray-50">
    <!-- Map Header -->
    <div class="relative overflow-hidden rounded-2xl bg-blue-500 p-6 text-white border border-blue-600 mb-4">
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ t('titles.interactive_map') }}</h1>
            <p class="text-blue-100">{{ t('descriptions.map_overview') }}</p>
          </div>
          <div class="hidden md:block">
            <Map class="h-12 w-12 text-blue-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Controls -->
    <div class="absolute top-24 left-4 z-20 space-y-2">
      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <div class="flex flex-col space-y-2">
          <Button 
            size="sm" 
            variant="outline" 
            class="w-full justify-start text-xs"
            @click="toggleDrawing"
          >
            <Navigation class="w-4 h-4 mr-2" />
            {{ isDrawing ? t('buttons.stop_drawing') : t('buttons.start_drawing') }}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            class="w-full justify-start text-xs"
            @click="clearDrawing"
          >
            <Layers class="w-4 h-4 mr-2" />
            {{ t('buttons.clear_drawing') }}
          </Button>
        </div>
      </div>

      <!-- Legend -->
      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 class="font-medium mb-2 text-gray-800 text-sm">{{ t('titles.map_legend') }}</h3>
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded"></div>
            <span class="text-xs text-gray-700">{{ t('legend.approved_land') }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded"></div>
            <span class="text-xs text-gray-700">{{ t('legend.pending_land') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 mx-4">
      <div id="map" class="h-[600px] w-full"></div>
    </div>

    <!-- Map Statistics -->
    <div class="absolute bottom-4 right-4 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <h3 class="font-medium mb-2 text-gray-800 text-sm">{{ t('titles.map_stats') }}</h3>
      <div class="space-y-1 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-600">{{ t('stats.total_parcels') }}:</span>
          <span class="font-medium text-gray-800">{{ totalParcels }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">{{ t('stats.zoom_level') }}:</span>
          <span class="font-medium text-gray-800">{{ currentZoom }}</span>
        </div>
      </div>
    </div>

    <!-- Drawing Info -->
    <div 
      v-if="tooltipText && tooltipCoord" 
      class="absolute bg-white px-2 py-1 rounded shadow-md text-xs border pointer-events-none z-30"
      :style="{ left: tooltipCoord[0] + 'px', top: tooltipCoord[1] + 'px' }"
    >
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Feature, Map as OLMap, View, type MapBrowserEvent } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { LineString, Polygon } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import { onMounted, ref, computed } from 'vue'
import { getLength, getArea } from 'ol/sphere'
import { Style, Stroke, Fill } from 'ol/style'
import type { EventsKey } from 'ol/events'
import type { Coordinate } from 'ol/coordinate'
import { unByKey } from 'ol/Observable'
import { useI18n } from 'vue-i18n'
import { Map, Layers, Search, Navigation } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useLandStore } from '@/stores/landStore'

const { t } = useI18n()

// Reactive variables for the template
const currentZoom = ref(12)

// Use land store to get total parcels
const landStore = useLandStore()
const totalParcels = computed(() => landStore.landCount)

// Load lands when component mounts
landStore.fetchLands()

// Map instance and drawing
const map = ref<OLMap | null>(null)
const drawInteraction = ref<Draw | null>(null)
const isDrawing = ref(false)
const sketch = ref<Feature | null>(null)

const tooltipCoord = ref<Coordinate | null>(null)
const tooltipText = ref('')

// Rwanda coordinates (Kigali area)
const center = ref([30.0588, -1.9441]) // [longitude, latitude] for Kigali, Rwanda
const projection = ref('EPSG:4326')
const zoom = ref(10)

// Vector source for drawings
let vectorSource: VectorSource
let vectorLayer: VectorLayer<VectorSource>

let listener: EventsKey
const continueLineMsg = 'Click to continue drawing'

function drawstart(evt: any) {
  sketch.value = evt.feature
  const geom = sketch.value.getGeometry()
  
  if (geom instanceof LineString) {
    tooltipCoord.value = geom.getLastCoordinate()
    listener = geom.on('change', function (evt) {
      const geom = evt.target
      if (geom instanceof LineString) {
        tooltipText.value = formatLength(geom)
        tooltipCoord.value = geom.getLastCoordinate()
      }
    })
  } else if (geom instanceof Polygon) {
    tooltipCoord.value = geom.getInteriorPoint().getCoordinates()
    listener = geom.on('change', function (evt) {
      const geom = evt.target
      if (geom instanceof Polygon) {
        tooltipText.value = formatArea(geom)
        tooltipCoord.value = geom.getInteriorPoint().getCoordinates()
      }
    })
  }
}

function drawend() {
  // remove drawn sketch
  sketch.value = null
  // unset tooltip so that a new one can be created
  tooltipCoord.value = null
  tooltipText.value = ''
  // cleanup listeners
  unByKey(listener)
}

function formatLength(line: LineString) {
  const length = getLength(line)
  let output = ''
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm'
  }
  return output
}

function formatArea(polygon: Polygon) {
  const area = getArea(polygon)
  let output = ''
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km²'
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm²'
  }
  return output
}

// Drawing controls
function toggleDrawing() {
  if (!map.value) return

  if (isDrawing.value) {
    // Stop drawing
    if (drawInteraction.value) {
      map.value.removeInteraction(drawInteraction.value)
      drawInteraction.value = null
    }
    isDrawing.value = false
  } else {
    // Start drawing
    drawInteraction.value = new Draw({
      source: vectorSource,
      type: 'LineString',
      style: new Style({
        stroke: new Stroke({
          color: '#3b82f6',
          width: 3,
        }),
      }),
    })

    drawInteraction.value.on('drawstart', drawstart)
    drawInteraction.value.on('drawend', drawend)

    map.value.addInteraction(drawInteraction.value)
    isDrawing.value = true
  }
}

function clearDrawing() {
  if (vectorSource) {
    vectorSource.clear()
  }
  tooltipCoord.value = null
  tooltipText.value = ''
}

// Initialize the map
const initializeMap = () => {
  // Create vector source for drawings
  vectorSource = new VectorSource({
    wrapX: false,
  })

  // Create vector layer for drawings
  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: '#3b82f6',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(59, 130, 246, 0.1)',
      }),
    }),
  })

  // Create the map
  map.value = new OLMap({
    target: 'map',
    layers: [
      // Base tile layer (OpenStreetMap)
      new TileLayer({
        source: new OSM(),
      }),
      // Vector layer for drawings
      vectorLayer,
    ],
    view: new View({
      center: center.value,
      zoom: zoom.value,
      projection: projection.value,
    }),
  })

  // Update current zoom when view changes
  map.value.getView().on('change:resolution', () => {
    currentZoom.value = Math.round(map.value!.getView().getZoom() || 10)
  })
}

onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
.bg-white {
  background: #ffffff;
}
</style>
