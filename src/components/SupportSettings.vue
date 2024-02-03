<template>
  <div class="support-settings">
    <h3>{{ $t('support.title') }}</h3>

    <CustomTooltip isRightAligned>
      <template v-slot:tooltip>
        {{ $t('toggleSupportTooltip') }}
      </template>
      <div class="toggle-switch" :class="{ 'switch-on': toggleState }" @click="toggleState = !toggleState">
        <div class="switch"></div>
      </div>
    </CustomTooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleState: false,
    };
  },
  watch: {
    toggleState(newValue) {
      this.saveToggleStateToCookie(newValue);
      this.emitUpdate();
    },
  },
  mounted() {
    this.loadToggleStateFromCookie();
    this.addScrollListeners();
  },
  methods: {
    emitUpdate() {
      this.$emit('updateSettings', {
        toggleState: this.toggleState,
      });
    },
    getData() {
      return {
        kind: this.kind,
        placement: this.placement,
        supportSpacing: this.spacing,
        toggleState: this.toggleState,
      };
    },
    addScrollListeners() {
      this.$nextTick(() => {
        ['widthInput', 'heightInput', 'spacingInput', 'thicknessInput'].forEach(refName => {
          if (this.$refs[refName]) {
            this.$refs[refName].addEventListener('wheel', this.handleScrollInput);
          }
        });
      });
    },
    handleScrollInput(event) {
      const input = event.target;
      const step = parseFloat(input.step) || 1;
      if (event.deltaY < 0) {
        input.value = parseFloat(input.value) + step;
      } else {
        input.value = parseFloat(input.value) - step;
      }
      // Emitting the input event to update Vue's data model
      input.dispatchEvent(new Event('input'));
      // Prevent the page from scrolling
      event.preventDefault();
    },
    updateData(data) {
      if (data.kind !== undefined) this.kind = data.kind;
      if (data.placement !== undefined) this.placement = data.placement;
      if (data.supportSpacing !== undefined) this.spacing = parseFloat(data.supportSpacing);
      if (data.toggleState !== undefined) {
        this.toggleState = data.toggleState;
      }
    },
    saveToggleStateToCookie(state) {
      document.cookie = `toggleState=${state};path=/;max-age=31536000`; // 1 Jahr Gültigkeit
    },

    loadToggleStateFromCookie() {
      const toggleCookie = document.cookie.split('; ').find(row => row.startsWith('toggleState='));
      if (toggleCookie) {
        const toggleValue = toggleCookie.split('=')[1] === 'true';
        this.toggleState = toggleValue;
      }
    },
  }
}
</script>

<style scoped>
.support-settings {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.spacing-label {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
}

.spacing-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kind,
.placement {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kind label,
.kind div,
.placement label,
.placement div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.toggle-switch {
  width: 50px;
  height: 25px;
  background-color: #ccc;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch {
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s ease;
}

.toggle-switch.switch-on .switch {
  left: 26px;
}

.toggle-switch.switch-on {
  background-color: #4CAF50;
}
</style>
