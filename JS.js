document.addEventListener('DOMContentLoaded', function() {

    const categories = {
        bestSound: {
            rows: [7, 8, 9, 6],
            seats: [],
            color: "green"
        },
        bestVisual: {
            rows: [4, 5, 2, 3, 6],
            seats: {
                2: [2, 13],
                3: [2, 13]
            },
            color: "blue"
        },
        closeToExit: {
            rows: [10, 11, 12],
            seats: {},
            color: "cyan",
            allEnds: true
        },
        vipSeating: {
            rows: [6],
            seats: {},
            color: "golden"
        },
        accessibleSeating: {
            rows: [1],
            seats: {
                6: [1, 14]
            },
            color: "red"
        },
        quietCorners: {
            rows: [1,2, 11, 12],
            seats: {
                1: [1, 2],
                2:[1,2],
                11:[1,2],
                12: [1, 2]
            },
            color: "purple"
        }
    };

    for (const [category, details] of Object.entries(categories)) {
        document.getElementById(category).addEventListener('change', function() {
            toggleHighlight(details, this.checked);
        });
    }

    function toggleHighlight(details, isChecked) {
        details.rows.forEach(row => {
            for (let seat = 1; seat <= 14; seat++) {
                let shouldHighlight = true;

                if (details.seats[row]) {
                    shouldHighlight = seat >= details.seats[row][0] && seat <= details.seats[row][1];
                }

                if (shouldHighlight) {
                    let element = document.getElementById(`row${row}-seat${seat}`);
                    updateSeatColor(element, details.color, isChecked);
                }
            }
        });

        if (details.allEnds) {
            for (let row = 1; row <= 12; row++) {
                updateSeatColor(document.getElementById(`row${row}-seat1`), details.color, isChecked);
                updateSeatColor(document.getElementById(`row${row}-seat14`), details.color, isChecked);
            }
        }
    }

    function updateSeatColor(element, color, add) {
        let currentClass = element.getAttribute("class") || "";
        if (add) {
            if (!currentClass.includes(color)) {
                element.setAttribute("class", `${currentClass} ${color}`.trim());
            }
        } else {
            element.setAttribute("class", currentClass.replace(color, "").trim());
        }
        resolveMultipleColors(element);
    }

    function resolveMultipleColors(element) {
        let currentClass = element.getAttribute("class");
        let colors = ["golden", "green", "blue", "purple", "red", "cyan"];
        let activeColors = colors.filter(color => currentClass.includes(color));
        
        if (activeColors.length > 1) {
            activeColors.sort((a, b) => colors.indexOf(a) - colors.indexOf(b)); // Custom sorting
            element.setAttribute("class", "seat " + activeColors.join('-'));
        }
    }

    
    document.getElementById('uncheckAll').addEventListener('change', function() {
        if(this.checked) {
            // Uncheck all other checkboxes
            document.querySelectorAll('.preferences input[type="checkbox"]').forEach(function(checkbox) {
                checkbox.checked = false;
            });
            // Ensure the "Uncheck All" checkbox is also unchecked
            this.checked = false;

            // Remove color from all seats
            document.querySelectorAll('.seat').forEach(function(seat) {
                seat.className = 'seat';
            });
        }
    });

    document.getElementById('increment').addEventListener('click', function() {
        let seatCount = document.getElementById('seatCount');
        if(parseInt(seatCount.innerText) < 9) {
            seatCount.innerText = parseInt(seatCount.innerText) + 1;
        }
        updateButtons();
    });
    
    document.getElementById('decrement').addEventListener('click', function() {
        let seatCount = document.getElementById('seatCount');
        if(parseInt(seatCount.innerText) > 1) {
            seatCount.innerText = parseInt(seatCount.innerText) - 1;
        }
        updateButtons();
    });
    
    function updateButtons() {
        let seatCount = parseInt(document.getElementById('seatCount').innerText);
        document.getElementById('increment').disabled = seatCount >= 9;
        document.getElementById('decrement').disabled = seatCount <= 1;
    }
    
    // Initialize the buttons state
    updateButtons();
    
    document.querySelectorAll('.seat').forEach(seat => {
        seat.addEventListener('click', function() {
            let seatCount = parseInt(document.getElementById('seatCount').innerText);
    
            // Clear previously selected seats
            document.querySelectorAll('.seat.selected').forEach(selectedSeat => {
                selectedSeat.classList.remove('selected');
            });
    
            let currentRow = this.parentNode; // Assumes each row is a parent container of seats
            let currentSeatIndex = Array.from(currentRow.children).indexOf(this);
            let seatsToSelect = [];
            let availableSeats = 0;
            
            // Check available seats to the right
            for (let i = currentSeatIndex; i < currentSeatIndex + seatCount; i++) {
                if (currentRow.children[i] && !currentRow.children[i].classList.contains('occupied')) {
                    availableSeats++;
                } else {
                    break;
                }
            }
            
            // If not enough seats to the right, check to the left
            if (availableSeats < seatCount) {
                for (let i = currentSeatIndex; i > currentSeatIndex - seatCount; i--) {
                    if (currentRow.children[i] && !currentRow.children[i].classList.contains('occupied')) {
                        seatsToSelect.push(i);
                    } else {
                        seatsToSelect = []; // reset the seatsToSelect array if a seat is occupied
                        break;
                    }
                }
            } else {
                for (let i = currentSeatIndex; i < currentSeatIndex + seatCount; i++) {
                    seatsToSelect.push(i);
                }
            }
            
            // Apply 'selected' class to seats to select
            seatsToSelect.forEach(index => {
                currentRow.children[index].classList.add('selected');
            });
        });
    });
    
    
    
});