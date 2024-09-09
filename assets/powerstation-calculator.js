(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const productTitle = window.powerStationCalculator.productTitle;
    const productCapacity = window.powerStationCalculator.productCapacity;
    const productDetails = `Power Station : ${productTitle}, Wattage: ${productCapacity}`;

    function loadSavedDevices() {
      const key = `${productTitle}_devices`;
      const devices = JSON.parse(localStorage.getItem(key) || "[]");

      const applicationsGrid = document.querySelector(".applications-grid");
      if (!applicationsGrid) {
        console.error("Could not find .applications-grid");
        return;
      }

      devices.forEach((device) => {
        const card = document.createElement("div");
        card.className = "application-card chatbot-card";
        card.innerHTML = `
      <div class="application-card__image">
        <svg width="66" height="45" viewBox="0 0 66 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.8845 0.708943C45.2552 0.571978 44.3952 0.480668 43.9966 0.503496C43.5981 0.526323 42.8429 0.617635 42.3185 0.731772C41.7941 0.845909 40.8082 1.23397 40.116 1.59921C39.3398 1.98728 34.3894 6.02774 27.3203 12.0085C21.806 16.6627 17.1759 20.6639 16.0601 21.7313C15.877 21.9065 15.8431 22.1276 15.9712 22.3463C16.3299 22.959 17.2259 24.2987 18.2585 25.7735C19.8946 28.0867 20.7966 29.19 20.9644 29.0835C21.1113 28.9922 26.3344 24.6093 32.5644 19.359C38.7944 14.1087 44.1015 9.70296 44.3532 9.58882C44.6259 9.47468 45.2342 9.38338 45.7167 9.38338C46.2201 9.38338 46.8704 9.566 47.1851 9.79427C47.4997 9.99972 50.1218 13.4923 52.9955 17.5556C57.3586 23.6505 58.2606 25.043 58.2606 25.6594C58.2816 26.0474 58.1138 26.6181 57.904 26.8692C57.6943 27.1431 55.4498 29.1063 52.9116 31.2521C50.3735 33.375 48.0451 35.2469 47.7095 35.3839C47.3319 35.5436 46.9543 35.5665 46.5558 35.8667C46.2201 35.8148 45.486 34.4936 44.7728 33.4663C44.4387 32.9855 44.1157 32.5469 43.8663 32.234C43.59 31.8872 43.2185 31.873 42.8686 32.1452C42.4771 32.4498 41.9143 32.9063 41.3116 33.4207C40.2209 34.3338 39.1511 35.2241 38.8993 35.4523C38.6403 35.6574 38.5869 36.0303 38.7772 36.3004C40.9875 39.4375 42.1387 40.9211 42.738 41.6386C43.3883 42.3919 44.3532 43.2137 44.9406 43.5332C45.5069 43.83 46.5558 44.1953 47.248 44.3094C48.108 44.4692 48.9051 44.4463 49.7652 44.2866C50.4574 44.1496 51.4852 43.7844 52.0726 43.4648C52.6389 43.1452 55.5756 40.794 58.5753 38.2601C62.6237 34.8132 64.197 33.3294 64.6794 32.5076C65.057 31.9141 65.5185 30.7955 65.7073 30.0422C65.959 29.0835 66.0429 28.1932 65.98 27.0747C65.917 26.0474 65.7073 25.0202 65.3717 24.2212C65.057 23.4679 62.0784 19.085 57.925 13.2869C54.1283 7.94525 50.6462 3.26562 50.1847 2.85472C49.7232 2.44383 48.8212 1.85032 48.1919 1.53073C47.5626 1.21115 46.5138 0.845908 45.8845 0.708943Z" fill="white"/>
        <path d="M20.9225 1.55356C19.8107 0.982872 19.2444 0.823082 17.8809 0.777427C16.874 0.731772 15.8671 0.845907 15.3637 1.0057C14.9022 1.18832 14.189 1.5079 13.7905 1.73618C13.3919 1.96445 10.602 4.22437 7.6024 6.75822C4.60276 9.29207 1.95972 11.6661 1.708 12.0314C1.45628 12.3966 1.07871 13.1043 0.847964 13.6065C0.596246 14.1087 0.302575 15.1359 0.155739 15.8892C-0.033049 16.8708 -0.0540228 17.6469 0.113789 18.6285C0.218672 19.3818 0.491364 20.4547 0.722105 21.0254C0.952847 21.5961 4.14127 26.2529 7.79118 31.4119C11.4621 36.5709 14.8812 41.2277 15.4266 41.7755C15.972 42.3234 17.0628 43.1224 17.8809 43.5561C19.0346 44.1496 19.7058 44.355 21.0274 44.4692C22.0133 44.5377 23.1879 44.492 23.8592 44.3322C24.4885 44.1953 25.5163 43.7844 26.1037 43.4419C26.712 43.0995 32.3966 38.4656 38.7315 33.1239C45.0874 27.7823 50.2686 23.2853 50.2686 23.1483C50.2896 22.9885 49.1778 21.2993 47.8143 19.4275C46.8816 18.111 46.0298 16.9599 45.5616 16.3875C45.3352 16.1108 45.0459 16.1053 44.7675 16.3295C43.3814 17.4456 38.7772 21.2942 33.4035 25.8191C25.3905 32.5761 21.5518 35.6806 21.0693 35.7719C20.7127 35.8404 20.0624 35.7947 19.6639 35.6578C19.2653 35.5208 18.7829 35.2697 18.5941 35.1099C18.4053 34.9501 16.014 31.7086 13.287 27.8736C10.5391 24.0386 8.14779 20.6145 7.97998 20.2264C7.70728 19.6786 7.6863 19.4046 7.87509 18.8568C8.0429 18.3546 9.51126 16.9849 13.1612 13.9032C17.1467 10.5019 18.3214 9.61165 18.8248 9.61165C19.1604 9.61165 19.6219 9.70296 19.8107 9.8171C20.0205 9.93123 20.7127 10.753 21.342 11.6433C21.9713 12.5564 22.6216 13.2412 22.7474 13.2184C22.8943 13.1727 24.006 12.3281 25.2017 11.3237C26.0731 10.6043 26.8262 9.90824 27.1911 9.52087C27.3649 9.33641 27.3882 9.10137 27.2596 8.883C26.9458 8.34998 26.2208 7.28413 25.3905 6.14188C24.2787 4.58961 23.125 3.10582 22.8104 2.80907C22.5167 2.51231 21.6776 1.96445 20.9225 1.55356Z" fill="white"/>
        </svg>
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${device.name}</div>
        <div class="application-card__runtime">
          ${device.estimatedRuntime.value} ${device.estimatedRuntime.unit}
        </div>
      </div>
    `;
        applicationsGrid.appendChild(card);
      });
    }

    function debugLocalStorage() {
      const key = `${productTitle}_devices`;
      const devices = JSON.parse(localStorage.getItem(key) || "[]");
      console.log(`Local Storage for ${productTitle}:`, devices);

      // Output each device separately for easier reading
      devices.forEach((device, index) => {
        console.log(`Device ${index + 1}:`, device);
      });

      // Also output all localStorage keys
      console.log("All localStorage keys:", Object.keys(localStorage));
    }

    loadSavedDevices();
    debugLocalStorage();

    class Carousel {
      constructor(element) {
        this.carousel = element;
        this.container = this.carousel.querySelector(".carousel__container");
        this.track = this.carousel.querySelector(".carousel__track");
        this.items = this.track.children;
        this.prevButton = this.carousel.querySelector(
          ".carousel__button--left"
        );
        this.nextButton = this.carousel.querySelector(
          ".carousel__button--right"
        );

        this.currentIndex = 0;
        this.itemWidth = 0;

        this.setEventListeners();
      }

      setEventListeners() {
        this.prevButton.addEventListener("click", () => this.slide("prev"));
        this.nextButton.addEventListener("click", () => this.slide("next"));

        let startX,
          isDragging = false,
          startPos;

        const gestureStart = (e) => {
          startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
          isDragging = true;
          startPos = this.track.style.transform
            ? parseInt(this.track.style.transform.slice(11))
            : 0;
          this.track.style.transition = "none";
        };

        const gestureMove = (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
          const diff = x - startX;
          this.track.style.transform = `translateX(${startPos + diff}px)`;
        };

        const gestureEnd = () => {
          if (!isDragging) return;
          isDragging = false;
          this.track.style.transition = "";
          const endPos = this.track.style.transform
            ? parseInt(this.track.style.transform.slice(11))
            : 0;
          const diff = endPos - startPos;
          if (Math.abs(diff) > this.itemWidth / 4) {
            this.slide(diff > 0 ? "prev" : "next");
          } else {
            this.slide("stay");
          }
        };

        this.track.addEventListener("mousedown", gestureStart);
        this.track.addEventListener("touchstart", gestureStart);
        window.addEventListener("mousemove", gestureMove);
        window.addEventListener("touchmove", gestureMove, { passive: false });
        window.addEventListener("mouseup", gestureEnd);
        window.addEventListener("touchend", gestureEnd);
      }

      updateItemWidth() {
        if (this.items.length > 0) {
          this.itemWidth = this.items[0].getBoundingClientRect().width;
        }
      }

      slide(direction) {
        if (this.items.length === 0) return;

        if (direction === "next" && this.currentIndex < this.items.length - 1) {
          this.currentIndex++;
        } else if (direction === "prev" && this.currentIndex > 0) {
          this.currentIndex--;
        }
        const offset = -this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(${offset}px)`;
      }

      addItem(content) {
        const item = document.createElement("div");
        item.className = "carousel__item";
        item.innerHTML = content;
        this.track.appendChild(item);
        this.items = this.track.children;
        this.updateItemWidth();
      }
    }

    function handleCarouselButtonClick(button) {
      console.log("Carousel button clicked:", button);
      if (button.request && button.request.type) {
        handleButtonClick(button);
      } else {
        console.error("Invalid button data:", button);
      }
    }

    function addCarousel(carouselData) {
      const messageContainer = document.getElementById("messageContainer");
      const carouselElement = document.createElement("div");
      carouselElement.className = "carousel";
      carouselElement.innerHTML = `
          <div class="carousel__container">
            <div class="carousel__track"></div>
          </div>
          <button class="carousel__button carousel__button--left" aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="carousel__button carousel__button--right" aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;

      const carousel = new Carousel(carouselElement);

      carouselData.cards.forEach((card) => {
        const itemContent = `
            <div class="carousel__item-content">
              <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
              <h6 class="carousel__item-title">${card.title}</h6>
              <p class="carousel__item-description">${card.description.text}</p>
              <button class="button carousel__item-button" data-button-index="0">${card.buttons[0].name}</button>
            </div>
          `;
        carousel.addItem(itemContent);
      });

      // Add event listeners to the buttons
      const buttons = carouselElement.querySelectorAll(
        ".carousel__item-button"
      );
      buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
          const cardIndex = Math.floor(
            index / carouselData.cards[0].buttons.length
          );
          const buttonIndex = index % carouselData.cards[0].buttons.length;
          handleCarouselButtonClick(
            carouselData.cards[cardIndex].buttons[buttonIndex]
          );
        });
      });

      messageContainer.appendChild(carouselElement);
      scrollToBottom();
    }

    const userID = `${Math.floor(Math.random() * 1000000000000000)}`;
    console.log("User ID:", userID);

    console.log("Product Title:", productTitle);
    console.log("Product Capacity:", productCapacity);

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const gadgetInteract = async (payload) => {
      const response = await fetch(
        "https://chatbottings--development.gadget.app/voiceflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Gadget API error: ${response.status}`);
      }

      return await response.json();
    };

    const sendLaunch = async () => {
      showTypingIndicator();

      // Log the product information
      console.log("Product Title Send:", productTitle);
      console.log("Product Capacity Send:", productCapacity);

      const interactPayload = {
        userID: userID,
        userAction: {
          type: "launch",
          payload: {
            startBlock: "shopifySection",
            powerStationDetails: productDetails,
          },
        },
      };

      // Log the entire payload
      console.log("Launch payload:", JSON.stringify(interactPayload, null, 2));

      try {
        const res = await gadgetInteract(interactPayload);
        console.log("Launch response:", res);
        hideTypingIndicator();
        handleAgentResponse(res);
      } catch (error) {
        console.error("Error launching conversation:", error);
        hideTypingIndicator();
      }
    };

    const sendMessage = async (message) => {
      showTypingIndicator();
      try {
        const res = await gadgetInteract({
          userID: userID,
          userAction: {
            type: "text",
            payload: message,
          },
        });
        console.log("Message response:", res);
        hideTypingIndicator();
        handleAgentResponse(res);
      } catch (error) {
        console.error("Error sending message:", error);
        hideTypingIndicator();
      }
    };

    function markdownToHtml(markdown) {
      return markdown
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, "<br>");
    }

    function showTypingIndicator() {
      const typingIndicator = document.querySelector(".chat-typing");
      typingIndicator.style.display = "flex";
      typingIndicator.classList.add("active");
      scrollToBottom();
    }

    function hideTypingIndicator() {
      const typingIndicator = document.querySelector(".chat-typing");
      typingIndicator.style.display = "none";
      typingIndicator.classList.remove("active");
    }

    function scrollToBottom() {
      const chatMessages = document.getElementById("chatMessages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addMessage(sender, content) {
      const messageContainer = document.getElementById("messageContainer");
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", `message--${sender}`);

      const iconSvg =
        sender === "assistant"
          ? '<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8566 0.0949741C20.5705 0.0327174 20.1796 -0.00878708 19.9985 0.00158904C19.8173 0.0119652 19.4741 0.0534703 19.2357 0.105351C18.9973 0.157231 18.5492 0.333624 18.2345 0.499642C17.8817 0.676036 15.6315 2.51261 12.4183 5.23115C10.1121 7.17766 8.14608 8.8729 7.4516 9.50931C7.26478 9.68051 7.23297 9.89295 7.36802 10.1074C7.56866 10.4259 7.91296 10.9361 8.2993 11.488C9.04301 12.5394 9.45301 13.0409 9.52929 12.9925C9.59603 12.951 11.9702 10.9588 14.802 8.57226C17.6338 6.18575 20.0461 4.18316 20.1606 4.13128C20.2845 4.0794 20.561 4.0379 20.7803 4.0379C21.0091 4.0379 21.3047 4.12091 21.4478 4.22467C21.5908 4.31805 22.7826 5.9056 24.0889 7.75255C26.0721 10.523 26.4821 11.1559 26.4821 11.4361C26.4916 11.6125 26.4154 11.8719 26.32 11.986C26.2247 12.1105 25.2044 13.0029 24.0507 13.9782C22.897 14.9432 21.8387 15.794 21.6861 15.8563C21.5145 15.9289 21.3429 15.9393 21.1617 15.8667C21.0091 15.8148 20.6754 15.4516 20.3512 14.9847C20.2856 14.8902 20.2209 14.7993 20.1594 14.715C19.8981 14.3568 19.5448 14.3315 19.2009 14.6114C19.0718 14.7164 18.9276 14.8362 18.778 14.9639C18.2822 15.379 17.7959 15.7837 17.6815 15.8874C17.5638 15.9806 17.5395 16.1501 17.626 16.2729C18.6307 17.6989 19.1539 18.3732 19.4264 18.6994C19.722 19.0418 20.1606 19.4153 20.4275 19.5606C20.685 19.6955 21.1617 19.8615 21.4764 19.9134C21.8673 19.986 22.2296 19.9756 22.6205 19.903C22.9352 19.8407 23.4024 19.6747 23.6693 19.5294C23.9268 19.3842 25.2617 18.3154 26.6251 17.1637C28.4653 15.5969 29.1804 14.9224 29.3997 14.5489C29.5714 14.2791 29.7811 13.7707 29.867 13.4283C29.9814 12.9925 30.0195 12.5878 29.9909 12.0794C29.9623 11.6125 29.8669 11.1455 29.7144 10.7824C29.5714 10.44 28.2174 8.44775 26.3295 5.81221C24.6038 3.3842 23.021 1.2571 22.8112 1.07033C22.6015 0.883558 22.1915 0.61378 21.9054 0.468515C21.6194 0.323249 21.1426 0.157231 20.8566 0.0949741Z" fill="#26c293"/><path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458138 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18575 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7058 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65208 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15353 20.1216 7.38002C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06513C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914686 9.85347 0.66566 9.51022 0.47889Z" fill="#26c293"/></svg>'
          : '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C16.9891 0 18.8968 0.790176 20.3033 2.1967C21.7098 3.60322 22.5 5.51088 22.5 7.5C22.5 9.48912 21.7098 11.3968 20.3033 12.8033C18.8968 14.2098 16.9891 15 15 15C13.0109 15 11.1032 14.2098 9.6967 12.8033C8.29018 11.3968 7.5 9.48912 7.5 7.5C7.5 5.51088 8.29018 3.60322 9.6967 2.1967C11.1032 0.790176 13.0109 0 15 0ZM15 18.75C23.2875 18.75 30 22.1063 30 26.25V30H0V26.25C0 22.1063 6.7125 18.75 15 18.75Z" fill="white"/></svg>';

      messageDiv.innerHTML = `
            <div class="message__icon">${iconSvg}</div>
            <div class="message__content">${markdownToHtml(content)}</div>
        `;

      messageContainer.appendChild(messageDiv);
      scrollToBottom();
    }

    function addButtons(buttons) {
      const messageContainer = document.getElementById("messageContainer");
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      buttons.forEach((button) => {
        const buttonElement = document.createElement("a");
        buttonElement.href = "#";
        buttonElement.classList.add("button", "chat-button");
        buttonElement.textContent = button.name;
        buttonElement.addEventListener("click", (e) => {
          e.preventDefault();
          handleButtonClick(button);
        });
        buttonContainer.appendChild(buttonElement);
      });

      messageContainer.appendChild(buttonContainer);
      scrollToBottom();
    }

    async function handleButtonClick(button) {
      addMessage("user", button.name);
      showTypingIndicator();
      try {
        const res = await gadgetInteract({
          userID: userID,
          userAction: button.request,
        });
        hideTypingIndicator();
        handleAgentResponse(res);
      } catch (error) {
        console.error("Error handling button click:", error);
        hideTypingIndicator();
      }
    }

    /// DEVICE CODE

    function saveDeviceEstimate(device) {
      const key = `${productTitle}_devices`;
      let devices = JSON.parse(localStorage.getItem(key) || "[]");

      // Check if this device already exists, and update it if so
      const existingIndex = devices.findIndex((d) => d.name === device.name);
      if (existingIndex !== -1) {
        devices[existingIndex] = device;
      } else {
        devices.push(device);
      }

      localStorage.setItem(key, JSON.stringify(devices));
    }

    // JavaScript
    function handleDeviceAnswer(payload) {
      console.log("Raw device answer payload:", payload);

      let deviceData;

      if (typeof payload === "string") {
        try {
          deviceData = JSON.parse(payload);
        } catch (error) {
          console.error("Failed to parse payload string:", error);
          return;
        }
      } else if (typeof payload === "object" && payload !== null) {
        deviceData = payload;
      } else {
        console.error("Invalid payload type:", typeof payload);
        return;
      }

      console.log("Processed device data:", deviceData);

      let devices = Array.isArray(deviceData) ? deviceData : deviceData.devices;

      if (!Array.isArray(devices)) {
        console.error("Invalid devices data:", devices);
        return;
      }

      const applicationsGrid = document.querySelector(".applications-grid");
      if (!applicationsGrid) {
        console.error("Could not find .applications-grid");
        return;
      }

      devices.forEach((device) => {
        devices.forEach((device) => {
          console.log("Processing device:", device);
          const { name, estimatedRuntime, powerConsumption } = device;
          saveDeviceEstimate({ name, estimatedRuntime, powerConsumption });
          const card = document.createElement("div");
          card.className = "application-card chatbot-card";
          card.innerHTML = `
            <div class="application-card__image">
                <svg width="66" height="45" viewBox="0 0 66 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.8845 0.708943C45.2552 0.571978 44.3952 0.480668 43.9966 0.503496C43.5981 0.526323 42.8429 0.617635 42.3185 0.731772C41.7941 0.845909 40.8082 1.23397 40.116 1.59921C39.3398 1.98728 34.3894 6.02774 27.3203 12.0085C21.806 16.6627 17.1759 20.6639 16.0601 21.7313C15.877 21.9065 15.8431 22.1276 15.9712 22.3463C16.3299 22.959 17.2259 24.2987 18.2585 25.7735C19.8946 28.0867 20.7966 29.19 20.9644 29.0835C21.1113 28.9922 26.3344 24.6093 32.5644 19.359C38.7944 14.1087 44.1015 9.70296 44.3532 9.58882C44.6259 9.47468 45.2342 9.38338 45.7167 9.38338C46.2201 9.38338 46.8704 9.566 47.1851 9.79427C47.4997 9.99972 50.1218 13.4923 52.9955 17.5556C57.3586 23.6505 58.2606 25.043 58.2606 25.6594C58.2816 26.0474 58.1138 26.6181 57.904 26.8692C57.6943 27.1431 55.4498 29.1063 52.9116 31.2521C50.3735 33.375 48.0451 35.2469 47.7095 35.3839C47.3319 35.5436 46.9543 35.5665 46.5558 35.8667C46.2201 35.8148 45.486 34.4936 44.7728 33.4663C44.4387 32.9855 44.1157 32.5469 43.8663 32.234C43.59 31.8872 43.2185 31.873 42.8686 32.1452C42.4771 32.4498 41.9143 32.9063 41.3116 33.4207C40.2209 34.3338 39.1511 35.2241 38.8993 35.4523C38.6403 35.6574 38.5869 36.0303 38.7772 36.3004C40.9875 39.4375 42.1387 40.9211 42.738 41.6386C43.3883 42.3919 44.3532 43.2137 44.9406 43.5332C45.5069 43.83 46.5558 44.1953 47.248 44.3094C48.108 44.4692 48.9051 44.4463 49.7652 44.2866C50.4574 44.1496 51.4852 43.7844 52.0726 43.4648C52.6389 43.1452 55.5756 40.794 58.5753 38.2601C62.6237 34.8132 64.197 33.3294 64.6794 32.5076C65.057 31.9141 65.5185 30.7955 65.7073 30.0422C65.959 29.0835 66.0429 28.1932 65.98 27.0747C65.917 26.0474 65.7073 25.0202 65.3717 24.2212C65.057 23.4679 62.0784 19.085 57.925 13.2869C54.1283 7.94525 50.6462 3.26562 50.1847 2.85472C49.7232 2.44383 48.8212 1.85032 48.1919 1.53073C47.5626 1.21115 46.5138 0.845908 45.8845 0.708943Z" fill="white"/>
                    <path d="M20.9225 1.55356C19.8107 0.982872 19.2444 0.823082 17.8809 0.777427C16.874 0.731772 15.8671 0.845907 15.3637 1.0057C14.9022 1.18832 14.189 1.5079 13.7905 1.73618C13.3919 1.96445 10.602 4.22437 7.6024 6.75822C4.60276 9.29207 1.95972 11.6661 1.708 12.0314C1.45628 12.3966 1.07871 13.1043 0.847964 13.6065C0.596246 14.1087 0.302575 15.1359 0.155739 15.8892C-0.033049 16.8708 -0.0540228 17.6469 0.113789 18.6285C0.218672 19.3818 0.491364 20.4547 0.722105 21.0254C0.952847 21.5961 4.14127 26.2529 7.79118 31.4119C11.4621 36.5709 14.8812 41.2277 15.4266 41.7755C15.972 42.3234 17.0628 43.1224 17.8809 43.5561C19.0346 44.1496 19.7058 44.355 21.0274 44.4692C22.0133 44.5377 23.1879 44.492 23.8592 44.3322C24.4885 44.1953 25.5163 43.7844 26.1037 43.4419C26.712 43.0995 32.3966 38.4656 38.7315 33.1239C45.0874 27.7823 50.2686 23.2853 50.2686 23.1483C50.2896 22.9885 49.1778 21.2993 47.8143 19.4275C46.8816 18.111 46.0298 16.9599 45.5616 16.3875C45.3352 16.1108 45.0459 16.1053 44.7675 16.3295C43.3814 17.4456 38.7772 21.2942 33.4035 25.8191C25.3905 32.5761 21.5518 35.6806 21.0693 35.7719C20.7127 35.8404 20.0624 35.7947 19.6639 35.6578C19.2653 35.5208 18.7829 35.2697 18.5941 35.1099C18.4053 34.9501 16.014 31.7086 13.287 27.8736C10.5391 24.0386 8.14779 20.6145 7.97998 20.2264C7.70728 19.6786 7.6863 19.4046 7.87509 18.8568C8.0429 18.3546 9.51126 16.9849 13.1612 13.9032C17.1467 10.5019 18.3214 9.61165 18.8248 9.61165C19.1604 9.61165 19.6219 9.70296 19.8107 9.8171C20.0205 9.93123 20.7127 10.753 21.342 11.6433C21.9713 12.5564 22.6216 13.2412 22.7474 13.2184C22.8943 13.1727 24.006 12.3281 25.2017 11.3237C26.0731 10.6043 26.8262 9.90824 27.1911 9.52087C27.3649 9.33641 27.3882 9.10137 27.2596 8.883C26.9458 8.34998 26.2208 7.28413 25.3905 6.14188C24.2787 4.58961 23.125 3.10582 22.8104 2.80907C22.5167 2.51231 21.6776 1.96445 20.9225 1.55356Z" fill="white"/>
                </svg>
            </div>
            <div class="application-card__content">
                <div class="application-card__title">${name}</div>
                <div class="application-card__runtime">
                    ${estimatedRuntime.value} ${estimatedRuntime.unit}
                </div>
            </div>
        `;
          applicationsGrid.appendChild(card);
        });
      });
    }

    // The handleAgentResponse function remains the same
    async function handleAgentResponse(response) {
      console.log("Full response:", JSON.stringify(response, null, 2));
      for (const trace of response) {
        console.log("Processing trace:", JSON.stringify(trace, null, 2));
        if (trace.type === "text") {
          addMessage("assistant", trace.payload.message);
          await delay(1000);
        } else if (trace.type === "choice") {
          addButtons(trace.payload.buttons);
        } else if (trace.type === "carousel") {
          addCarousel(trace.payload);
        } else if (trace.type === "device_answer") {
          handleDeviceAnswer(trace.payload);
        } else {
          console.log("Unknown trace type:", trace.type);
        }
      }
    }

    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userMessage = userInput.value.trim();
      if (userMessage) {
        addMessage("user", userMessage);
        userInput.value = "";
        showTypingIndicator();
        await sendMessage(userMessage);
      }
    });

    // Start the conversation
    sendLaunch();
  });
})();
