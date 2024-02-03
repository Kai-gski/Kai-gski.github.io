<template>
  <!-- Bereich für Dateieinstellungen -->
  <div class="file-settings">
    <h3>{{ $t('file.title') }}</h3>

    <!-- Sektion für Dateinameneingabe -->
    <div class="filename-section">
      <CustomTooltip isRightAligned>
        <template v-slot:tooltip>
          {{ $t('tooltips.filename') }}
        </template>
        <label for="filename">{{ $t('file.filename') }}</label>
      </CustomTooltip>
      <input v-model="filename" @input="emitUpdate" id="filename" type="text">
    </div>

    <!-- Sektion zum Generieren der STL-Datei -->
    <div class="generate-stl-section">
      <CustomTooltip isRightAligned>
        <template v-slot:tooltip>
          {{ $t('tooltips.generateStl') }}
        </template>
        <button @click="generateSTL">{{ $t('file.generateStl') }}</button>
      </CustomTooltip>
    </div>
  </div>
</template>

<script>
var gen = require('../dist/stlGenerator');
var global = require('./three/globalsSettings');
export default {
  data() {
    return {
      filename: 'model', // Name der zu generierenden Datei
      thickness: 3.0, // Dicke des Modells
      width: 12.0, // Breite des Modells
      supportEnabled: false, // Zustand des Supports
    };
  },
  methods: {
    emitUpdate() {
      // Sendet ein Update-Event mit den aktuellen Daten
      this.$emit('updateSettings', this.getData());
    },
    getData() {
      // Gibt die aktuellen Daten zurück
      return {
        filename: this.filename
      };
    },
    updateData(data) {
      // Aktualisiert die Daten basierend auf externen Änderungen
      if (data.filename !== undefined) this.filename = data.filename;
      if (data.thickness !== undefined) this.thickness = data.thickness;
      if (data.width !== undefined) this.width = data.width;
      if (data.height !== undefined) this.height = data.height;
      if (data.toggleState !== undefined) this.supportEnabled = data.toggleState;
        gen.setThickness(this.thickness);
        gen.setLen(this.width);
        gen.setSupport(this.supportEnabled);
        global.setisUpdate(true);
    },
    generateSTL() {
      gen.make(this.thickness, this.width, this.filename, true, false, this.supportEnabled, 10, 1);
      console.log(`Generating STL file for: ${this.filename}, thickness: ${this.thickness}, width: ${this.width}, support enabled: ${this.supportEnabled}`);
    },
  }
}
</script>

<style scoped>
.file-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filename-section,
.generate-stl-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.generate-stl-section button {
  width: 100%;
}
</style>

