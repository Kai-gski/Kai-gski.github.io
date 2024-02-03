<template>
  <!-- Hauptcontainer für die Einstellungen des Modells -->
  <div class="model-settings">
    <h3>{{ $t('model.title') }}</h3>
    <div>
      <!-- Tooltip für die Eingabe der Gleichung -->
      <CustomTooltip content="equation-input">
        <template v-slot:tooltip>
          {{ $t('tooltips.equation') }}
        </template>
        <label for="equation">{{ $t('model.equation') }} f(x,y)=</label>
      </CustomTooltip>
      <div class="equation-input">
        <!-- Eingabefeld für die Gleichung -->
        <input v-model="equation" @input="validateEquation" id="equation" type="text" class="equation-text"
          :class="{ 'is-invalid': !equationValid }">
        <!-- Hilfe-Icon für die Anzeige von Beispielen -->
        <span class="help-icon" @click="showEquationExamples = true">
          <!-- SVG für das Hilfe-Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd"
              d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Nachricht bei ungültiger Gleichung -->
    <span v-if="!equationValid" class="validation-message">{{ validationMessage }}</span>

    <!-- Overlay für die Anzeige von Gleichungsbeispielen -->
    <div v-if="showEquationExamples" class="equation-examples-overlay" @click="showEquationExamples = false">
      <div class="equation-examples" @click.stop>
        <!-- Schleife über die Beispiele für Gleichungen -->
        <div v-for="(example, index) in equationExamples" :key="index" class="example"
          @click="selectExample(example.simple)">
          <span class="example-text" v-html="example.display"></span>
          <img :src="example.image" :alt="'Example ' + index">
        </div>
      </div>
    </div>

    <!-- Container für die Breite -->
    <div class="dimension">
      <CustomTooltip content="dimension.width">
        <template v-slot:tooltip>
          {{ $t('tooltips.width') }}
        </template>
        <label for="width">{{ $t('model.width') }} [cm]</label>
      </CustomTooltip>
      <!-- Eingabefeld für die Breite, min auf 0 gesetzt -->
      <input v-model.number="width" @input="emitUpdate" id="width" type="number" ref="widthInput" min="0">
    </div>

    <!-- Container für die Höhe -->
    <div class="dimension">
      <CustomTooltip>
        <template v-slot:tooltip>
          {{ $t('tooltips.height') }}
        </template>
        <label for="height">{{ $t('model.height') }} [cm]</label>
      </CustomTooltip>
      <!-- Eingabefeld für die Höhe, min auf 0 gesetzt -->
      <input v-model.number="height" @input="emitUpdate" id="height" type="number" ref="heightInput" min="0">
    </div>

    <!-- Container für die Auswahl des Oberflächentyps -->
    <div class="surface">
      <CustomTooltip>
        <template v-slot:tooltip>
          {{ $t('tooltips.surface') }}
        </template>
        <label>{{ $t('model.surface') }}</label>
      </CustomTooltip>
      <!-- Auswahl für den soliden Oberflächentyp -->
      <div>
        <input type="radio" v-model="surfaceType" @change="emitUpdate" value="solid">
        <CustomTooltip>
          <template v-slot:tooltip>
            {{ $t('tooltips.surfaceSolid') }}
          </template>
          <label>{{ $t('model.solid') }}</label>
        </CustomTooltip>
      </div>
      <!-- Auswahl für den Gitter-Oberflächentyp -->
      <div>
        <input type="radio" v-model="surfaceType" @change="emitUpdate" value="grid">
        <CustomTooltip>
          <template v-slot:tooltip>
            {{ $t('tooltips.surfaceGrid') }}
          </template>
          <label>{{ $t('model.grid') }}</label>
        </CustomTooltip>
      </div>
    </div>

    <!-- Container für die Dicke -->
    <div class="thickness">
      <CustomTooltip content="model.thickness">
        <template v-slot:tooltip>
          {{ $t('tooltips.thickness') }}
        </template>
        <label for="thickness">{{ $t('model.thickness') }} [mm]</label>
      </CustomTooltip>
      <!-- Eingabefeld für die Dicke, min auf 0 gesetzt -->
      <input v-model.number="thickness" @input="emitUpdate" id="thickness" type="number" ref="thicknessInput" min="0">
    </div>
  </div>
</template>

  
<script>
import { setExpr } from '@/dist/parser';

export default {
  data() {
    return {
      equation: 'sin(x) * cos(y)',
      dimensionSize: 12.0,
      width: 12.0,
      height: 12.0,
      surfaceType: 'solid',
      thickness: 0.8,
      equationValid: true,
      validationMessage: '',
      showEquationExamples: false,
      equationExamples: [
        {
          display: '\\(f(x, y) = x^2 - y^2\\)',
          simple: 'x^2 - y^2',
          image: '../examples/ex1.png'
        },
        {
          display: '\\(f(x, y) = x^2 + y^2\\)',
          simple: 'x^2 + y^2',
          image: '../examples/ex2.png'
        },
        {
          display: '\\(f(x, y) = \\sin(x) \\cdot \\cos(y)\\)',
          simple: 'sin(x) * cos(y)',
          image: '../examples/ex3.png'
        },
        {
          display: '\\(f(x, y) = \\sqrt{x^{2} + y^{2}}\\)',
          simple: 'sqrt(x^2 + y^2)',
          image: '../examples/ex4.png'
        },
        {
          display: '\\(f(x, y) = \\left(1 + \\frac{y}{2} \\cos\\left(\\frac{x}{2}\\right)\\right) \\cos(x)\\)',
          simple: '(1 + (y/2) * cos(x/2)) * cos(x)',
          image: '../examples/ex5.png'
        }
      ],
    };
  },
  watch: {
    width(newWidth) {
      if (this.height !== newWidth) {
        this.height = newWidth;
      }
    },
    // Watcher for height changes
    height(newHeight) {
      if (this.width !== newHeight) {
        this.width = newHeight;
      }
    },
    showEquationExamples(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.updateMathJax();
        });
      }
    },
  },
  computed: {
    // Synchronized width and height
    size: {
      get() {
        return this.dimensionSize;
      },
      set(newValue) {
        // Set the flag to true before making changes
        this.isUpdating = true;
        this.dimensionSize = newValue;
        this.width = newValue;
        this.height = newValue;
        // Set the flag to false after changes are done
        this.isUpdating = false;
        // Emit update after all changes are done
        this.emitUpdate();
      }
    },
  },
  mounted() {
    this.loadSettingsFromCookies();
    this.addScrollListeners();
    this.emitUpdate();
  },
  methods: {
    emitUpdate() {
      if (!this.isUpdating) {
        this.$emit('updateSettings', {
          ...this.getData(),
          thickness: this.thickness,
          width: this.width,
          height: this.height,
          equation: this.equation,
        });
      }
      this.$emit('updateMeshView', this.surfaceType === 'grid');
    },
    getData() {
      return {
        equation: this.equation,
        width: this.width,
        height: this.height,
        surfaceType: this.surfaceType,
        thickness: this.thickness,
      };
    },
    addScrollListeners() {
      this.$nextTick(() => {
        if (this.$refs.widthInput) {
          this.$refs.widthInput.addEventListener('wheel', this.handleScrollInput);
        }
        if (this.$refs.heightInput) {
          this.$refs.heightInput.addEventListener('wheel', this.handleScrollInput);
        }
        if (this.$refs.thicknessInput) {
          this.$refs.thicknessInput.addEventListener('wheel', this.handleScrollInput);
        }
      });
    },
    handleScrollInput(event) {
      const input = event.target;
      const step = parseFloat(input.step) || 1;
      let newValue = parseFloat(input.value);
      if (event.deltaY < 0) {
        newValue += step;
      } else {
        newValue -= step;
      }

      // Überprüfen, ob der neue Wert unter dem Minimum liegt
      if (newValue < 0) {
        newValue = 0; // Setzen des Werts auf 0, falls er negativ wird
      }
      input.value = newValue;

      // Emitting the input event to update Vue's data model
      input.dispatchEvent(new Event('input'));

      // Prevent the page from scrolling
      event.preventDefault();
    },
    updateData(data) {
      if (data.equation !== undefined) this.equation = data.equation;
      if (data.width !== undefined) this.width = parseFloat(data.width);
      if (data.height !== undefined) this.height = parseFloat(data.height);
      if (data.surfaceType !== undefined) this.surfaceType = data.surfaceType;
      if (data.thickness !== undefined) this.thickness = parseFloat(data.thickness);
    },
    selectExample(simpleEquation) {
      this.equation = simpleEquation;
      this.showEquationExamples = false;
      this.validateEquation();
      this.emitUpdate();
    },
    updateMathJax() {
      if (window.MathJax) {
        window.MathJax.typesetPromise();
      }
    },
    validateEquation() {
      const equation = this.equation.trim();

      // Check if empty
      if (!equation) {
        this.equationValid = false;
        this.validationMessage = this.$t('validationMessages.emptyEquation');
        return;
      }

      // check for mathematical expressions
      const validMathExpr = /^(\b(sin|cos|tan|sqrt|log|exp|abs|ceil|floor|round|max|min)\b|\d+|\+|-|\*|\/|\^|\(|\)|\s|x|y|PI|E)+$/;
      if (!validMathExpr.test(equation)) {
        this.equationValid = false;
        this.validationMessage = this.$t('validationMessages.invalidCharacters');
        return;
      }

      // Check for mismatched parentheses
      if ((equation.match(/\(/g) || []).length !== (equation.match(/\)/g) || []).length) {
        this.equationValid = false;
        this.validationMessage = this.$t('validationMessages.mismatchedParentheses');
        return;
      }

      this.equationValid = true;
      this.validationMessage = '';
      this.emitUpdate();

      if (this.equationValid) {
        // Call setExpr when the equation is valid
        setExpr(equation);
      }
    },
    loadSettingsFromCookies() {
      const settingsCookie = document.cookie.split('; ').find(row => row.startsWith('settingsData='));
      if (settingsCookie) {
        const settingsString = settingsCookie.split('=')[1];
        try {
          const loadedSettings = JSON.parse(decodeURIComponent(settingsString));
          if (loadedSettings) {
            // Aktualisieren der lokalen Daten mit den geladenen Einstellungen
            this.width = loadedSettings.width || this.width;
            this.height = loadedSettings.height || this.height;
            this.surfaceType = loadedSettings.surfaceType || this.surfaceType;
            this.thickness = loadedSettings.thickness || this.thickness;
            if (loadedSettings.equation) {
              this.equation = loadedSettings.equation;
              setExpr(this.equation); // Aktualisieren der Gleichung im Modell
            }
          }
        } catch (e) {
          console.error('Fehler beim Laden der Einstellungen aus Cookies:', e);
        }
      }
    },
  }

}
</script>
  
<style scoped>
.model-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dimension {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.surface {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spacing {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thickness {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-content {
  background-color: #f9f9f9;
  padding: 5px;
  border-radius: 4px;
}

.equation-input {
  position: relative;
  display: flex;
  align-items: center;
}

.equation-text {
  flex-grow: 1;
  padding-right: 30px;
}

.equation-text.is-invalid {
  border-radius: 4px;
  border-color: red;
}

.validation-message {
  color: red;
  font-size: 12px;
}

.equation-examples-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.equation-examples {
  position: absolute;
  transform: translate(-45%, -40%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  margin-left: 470px;
  margin-top: 270px;
}

.example {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.example-text {
  margin-right: 10px;
}

.example img {
  height: 50px;
  width: 80px;
  margin-left: auto;
}

.help-icon {
  position: absolute;
  right: 1px;
  cursor: pointer;
  height: 24px;
  width: 24px;
  color: white;
}

.help-icon:hover {
  opacity: 0.6;
}
</style>
  
