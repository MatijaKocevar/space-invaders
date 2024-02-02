export const changeLog = () => {
    const changeLogWrapper = document.createElement('div');
    changeLogWrapper.classList.add('change-log');

    const title = document.createElement('h2');
    title.textContent = 'Change Log';

    changeLogWrapper.innerHTML = `
        <span class='change-log-item'>- Scores get stored and can be looked up.</span>
		<span class='change-log-item'>- Added sounds for player death, invader death, shooting.</span>
		<span class='change-log-item'>- Added explosions for player.</span>
		<span class='change-log-item'>- Lives added.</span>
		<span class='change-log-item'>- Score board added.</span>
		<span class='change-log-item'>- Explosions added for Invaders.</span>
		<span class='change-log-item'>- Shield crumble more realistic.</span>
		<span class='change-log-item'>- Sheild block crumble.</span>
		<span class='change-log-item'>- Added sheild blocks.</span>
		<span class='change-log-item'>- Click to reset.</span>
		<span class='change-log-item'>- Added game over sign.</span>
		<span class='change-log-item'>- Invaders shoot back.</span>
		<span class='change-log-item'>- Invaders move faster the fever there are.</span>
		<span class='change-log-item'>- Temporary mobile controls.</span>
		<span class='change-log-item'>- Invader movement resembles original.</span>
		<span class='change-log-item'>- Animated invader movement. Invaders move down. Reset button.</span>
		<span class='change-log-item'>- Added sprites for player and invaders.</span>
		<span class='change-log-item'>- Figured out how to check for collisions with projectiles.</span>
		<span class='change-log-item'>- Invader movement.</span>
		<span class='change-log-item'>- Added Invaders.</span>
		<span class='change-log-item'>- Added projectiles.</span>
		<span class='change-log-item'>- The player can move left/right with 'A/D' and shoot with 'Space'.</span>
		<span class='change-log-item'>- Added player.</span>
		<span class='change-log-item'>- Figured out how to animate things.</span>
		<span class='change-log-item'>- Drawn a box with Canvas API.</span>
        `;

    changeLogWrapper.prepend(title);

    return changeLogWrapper;
};
