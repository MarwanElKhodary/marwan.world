export const instructions = {
  ADD_COOLER:              "Great! Now you can add the Cooler on top of the CPU",
  ADD_RAM:                 "Last thing for the Motherboard is to add the RAM",
  ADD_MOTHERBOARD_TO_CASE: "Now you can insert the Motherboard in the Case!",
  ADD_GPU:                 "Insert the GPU underneath the Motherboard",
  ADD_HDD:                 "Hard Drive next.",
  ADD_PSU:                 "Last step! Fit the Power Supply in the Case so we can turn the PC on!",
  CONGRATS:                "Congratulations! You just built your first PC!",
};

export const svgElements = {
  CPU_ON_MOTHERBOARD: `
        <svg class="z-30 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-8/12 md:size-7/12 xl:size-6/12 2xl:size-9/12" id="cpu-on-motherboard">
            <use href="/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
        </svg>`,
  COOLER_ON_CPU: `
        <svg class="z-30 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-8/12 md:size-7/12 xl:size-6/12 2xl:size-9/12" id="cooler-on-cpu">
            <use href="/svg/cooler-on-cpu.svg#cooler-on-cpu"></use>
        </svg>`,
  RAM_ON_MOTHERBOARD: `
        <svg class="z-30 hover:cursor-grab drag-drop text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-8/12 md:size-7/12 xl:size-6/12 2xl:size-9/12" id="ram-on-motherboard">
            <use href="/svg/ram-on-motherboard.svg#ram-on-motherboard"></use>
        </svg>`,
  MOTHERBOARD_IN_CASE: `
        <svg class="z-30 dropzone max-h-[110px] 2xl:max-h-full text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-75 md:scale-150 xl:scale-[2.1] 2xl:scale-150" id="motherboard-in-case">
            <use href="/svg/motherboard-in-case.svg#motherboard-in-case"></use>
        </svg>`,
  GPU_IN_CASE: `
        <svg class="z-30 dropzone max-h-[110px] 2xl:max-h-full text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-75 md:scale-150 xl:scale-[2.1] 2xl:scale-150" id="gpu-in-case">
            <use href="/svg/gpu-in-case.svg#gpu-in-case"></use>
        </svg>`,
  HDD_IN_CASE: `
        <svg class="z-30 dropzone max-h-[110px] 2xl:max-h-full text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-75 md:scale-150 xl:scale-[2.1] 2xl:scale-150" id="hdd-in-case">
            <use href="/svg/hdd-in-case.svg#hdd-in-case"></use>
        </svg>`,
  PSU_IN_CASE: `
        <svg class="z-30 text-rock max-h-[110px] 2xl:max-h-full dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-75 md:scale-150 xl:scale-[2.1] 2xl:scale-150" id="psu-in-case">
            <use href="/svg/psu-in-case.svg#psu-in-case"></use>
        </svg>`,
  MONITOR_ON: `
        <svg class="place-self-center text-rock dark:text-gasoline fill-current size-9/12 2xl:size-10/12 scale-150" id="monitor-on">
            <use href="/svg/monitor-on.svg#monitor-on"></use>
        </svg>`,
};
