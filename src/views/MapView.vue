<template>
  <div class="relative h-screen bg-gray-50">
    <!-- Map Header -->
    <div class="relative overflow-hidden rounded-2xl bg-blue-500 p-8 text-white border border-blue-600">
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ t('titles.interactive_map') }}</h1>
            <p class="text-blue-100 text-lg">{{ t('descriptions.map_overview') }}</p>
          </div>
          <div class="hidden md:block">
            <Map class="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Map Controls -->
    <div class="absolute top-24 left-4 z-20 space-y-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <h3 class="font-semibold mb-3 text-blue-900">{{ t('titles.map_controls') }}</h3>
        <div class="bg-blue-600 p-2 rounded-lg">
          <Layers class="h-5 w-5 text-white" />
        </div>
        <div class="mt-3 space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="showLandParcels" class="rounded border-blue-300" />
            <span class="text-sm text-blue-900">{{ t('options.show_parcels') }}</span>
          </label>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <h3 class="font-semibold mb-3 text-blue-900">{{ t('titles.map_legend') }}</h3>
        <div class="bg-blue-100 p-2 rounded-lg">
          <Search class="h-5 w-5 text-blue-600" />
        </div>
        <div class="mt-3 space-y-2">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded"></div>
            <span class="text-sm text-blue-900">{{ t('legend.approved_land') }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-yellow-500 rounded"></div>
            <span class="text-sm text-blue-900">{{ t('legend.pending_land') }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <h3 class="font-semibold mb-3 text-blue-900">{{ t('titles.map_tools') }}</h3>
        <div class="bg-blue-500 p-2 rounded-lg">
          <Navigation class="h-5 w-5 text-white" />
        </div>
        <div class="mt-3 space-y-2">
          <Button size="sm" variant="outline" class="w-full border-blue-300 text-blue-700">
            {{ t('buttons.measure_distance') }}
          </Button>
          <Button size="sm" variant="outline" class="w-full border-blue-300 text-blue-700">
            {{ t('buttons.export_map') }}
          </Button>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <h3 class="font-semibold mb-3 text-blue-900">{{ t('titles.search_location') }}</h3>
        <Input
          v-model="searchQuery"
          :placeholder="t('placeholders.search_location')"
          class="mb-2"
        />
        <Button size="sm" class="w-full bg-blue-600 text-white">
          {{ t('buttons.search') }}
        </Button>
      </div>
    </div>

    <!-- Map Container -->
    <div class="bg-white rounded-2xl overflow-hidden border border-gray-200">
      <div id="map" class="h-[600px] w-full"></div>
    </div>

    <!-- Map Statistics -->
    <div class="absolute bottom-4 right-4 bg-white rounded-xl p-4 border border-gray-200">
      <h3 class="font-semibold mb-2 text-blue-900">{{ t('titles.map_stats') }}</h3>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-blue-700">{{ t('stats.total_parcels') }}:</span>
          <span class="font-semibold text-blue-900">{{ totalParcels }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-blue-700">{{ t('stats.visible_area') }}:</span>
          <span class="font-semibold text-blue-900">{{ visibleArea }} km²</span>
        </div>
        <div class="flex justify-between">
          <span class="text-blue-700">{{ t('stats.zoom_level') }}:</span>
          <span class="font-semibold text-blue-900">{{ currentZoom }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Feature, Map, View, type MapBrowserEvent } from 'ol'
import { LineString } from 'ol/geom'
import { type DrawEvent } from 'ol/interaction/Draw'
import { onMounted, ref } from 'vue'
import { getLength } from 'ol/sphere'
import type { EventsKey } from 'ol/events'
import type { Coordinate } from 'ol/coordinate'
import { unByKey } from 'ol/Observable'
import type { ObjectEvent } from 'ol/Object'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mapRef = ref<{ map: Map } | null>(null)
const drawType = ref('LineString')
const sketch = ref<Feature | null>(null)

const tooltipCoord = ref<Coordinate | null>(null)
const tooltipText = ref('')
const helpTooltipCoord = ref<Coordinate | null>(null)
const helpTooltipText = ref('')

const center = ref([40, 40])
const projection = ref('EPSG:4326')
const zoom = ref(12)
const view = ref<View>()
const position = ref([])
const showAsBar = ref(false)

let listener: EventsKey
const continueLineMsg = 'Click to continue drawing the line'

function drawstart(evt: DrawEvent) {
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

function showHelpInfoOnPointermove(evt: MapBrowserEvent<PointerEvent>) {
  if (evt.dragging) {
    return
  }
  let helpMsg = 'Click to start drawing'
  const geom = sketch.value?.getGeometry()
  if (geom instanceof LineString) {
    helpMsg = continueLineMsg
  }

  helpTooltipText.value = helpMsg
  helpTooltipCoord.value = evt.coordinate
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

const geoLocChange = (event: ObjectEvent) => {
  console.log('AAAAA', event)
  position.value = event.target.getPosition()
  view.value?.setCenter(event.target?.getPosition())
}

onMounted(() => {
  // @ts-expect-error It works bro
  mapRef.value?.map.on('pointermove', showHelpInfoOnPointermove)
  mapRef.value?.map.getViewport().addEventListener('mouseout', function () {
    helpTooltipCoord.value = null
    helpTooltipText.value = ''
  })
})
</script>

<style scoped>
.bg-white {
  background: #ffffff;
}
</style>
