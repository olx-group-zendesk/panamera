document.addEventListener("DOMContentLoaded", function() {
    // add "zen" namespace for various utilities
    window.zen = {
        webWidget: {
            show: function show() {
                if (typeof zE === "undefined") {
                    return;
                }
                if (zE("webWidget:get", "display") === "hidden") {
                    zE("webWidget", "show");
                    zE("webWidget", "open");
                } else if (zE("webWidget:get", "display") === "launcher") {
                    zE("webWidget", "open");
                }
            }
        }
    };

    // configure initial web widget and other elements involved
    if (typeof zE === "undefined") {
        var chatButton = document.querySelector(".blocks-button-chat");
        if (chatButton) {
            chatButton.setAttribute("style", "display:none;");
        }
    } else {
        zE("webWidget", "hide");
    }

    // add onmouseover functionality for telephone number contact channel button
    var button_phone_1 = document.querySelector("[name='phone-line-1']"),
        button_phone_2 = document.querySelector("[name='phone-line-2']");

    if (button_phone_1) {
        button_phone_1.addEventListener("mouseover", function() {
            button_phone_1.innerText = button_phone_1.dataset.phoneLine1Number;
        });
        button_phone_1.addEventListener("mouseout", function() {
            button_phone_1.innerText =
                button_phone_1.dataset.phoneLine1NumberTitle;
        });
    }

    if (button_phone_2) {
        button_phone_2.addEventListener("mouseover", function() {
            button_phone_2.innerText = button_phone_2.dataset.phoneLine2Number;
        });
        button_phone_2.addEventListener("mouseout", function() {
            button_phone_2.innerText =
                button_phone_2.dataset.phoneLine2NumberTitle;
        });
    }

    function closest(element, selector) {
        if (Element.prototype.closest) {
            return element.closest(selector);
        }
        do {
            if (
                (Element.prototype.matches && element.matches(selector)) ||
                (Element.prototype.msMatchesSelector &&
                    element.msMatchesSelector(selector)) ||
                (Element.prototype.webkitMatchesSelector &&
                    element.webkitMatchesSelector(selector))
            ) {
                return element;
            }
            element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);
        return null;
    }

    // social share popups
    Array.prototype.forEach.call(
        document.querySelectorAll(".share a"),
        function(anchor) {
            anchor.addEventListener("click", function(e) {
                e.preventDefault();
                window.open(this.href, "", "height = 500, width = 500");
            });
        }
    );

    // In some cases we should preserve focus after page reload
    function saveFocus() {
        var activeElementId = document.activeElement.getAttribute("id");
        sessionStorage.setItem("returnFocusTo", "#" + activeElementId);
    }
    var returnFocusTo = sessionStorage.getItem("returnFocusTo");
    if (returnFocusTo) {
        sessionStorage.removeItem("returnFocusTo");
        var returnFocusToEl = document.querySelector(returnFocusTo);
        returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // show form controls when the textarea receives focus or backbutton is used and value exists
    var commentContainerTextarea = document.querySelector(
            ".comment-container textarea"
        ),
        commentContainerFormControls = document.querySelector(
            ".comment-form-controls, .comment-ccs"
        );

    if (commentContainerTextarea) {
        commentContainerTextarea.addEventListener(
            "focus",
            function focusCommentContainerTextarea() {
                commentContainerFormControls.style.display = "block";
                commentContainerTextarea.removeEventListener(
                    "focus",
                    focusCommentContainerTextarea
                );
            }
        );

        if (commentContainerTextarea.value !== "") {
            commentContainerFormControls.style.display = "block";
        }
    }

    // Expand Request comment form when Add to conversation is clicked
    var showRequestCommentContainerTrigger = document.querySelector(
            ".request-container .comment-container .comment-show-container"
        ),
        requestCommentFields = document.querySelectorAll(
            ".request-container .comment-container .comment-fields"
        ),
        requestCommentSubmit = document.querySelector(
            ".request-container .comment-container .request-submit-comment"
        );

    if (showRequestCommentContainerTrigger) {
        showRequestCommentContainerTrigger.addEventListener(
            "click",
            function() {
                showRequestCommentContainerTrigger.style.display = "none";
                Array.prototype.forEach.call(requestCommentFields, function(e) {
                    e.style.display = "block";
                });
                requestCommentSubmit.style.display = "inline-block";

                if (commentContainerTextarea) {
                    commentContainerTextarea.focus();
                }
            }
        );
    }

    // Mark as solved button
    var requestMarkAsSolvedButton = document.querySelector(
            ".request-container .mark-as-solved:not([data-disabled])"
        ),
        requestMarkAsSolvedCheckbox = document.querySelector(
            ".request-container .comment-container input[type=checkbox]"
        ),
        requestCommentSubmitButton = document.querySelector(
            ".request-container .comment-container input[type=submit]"
        );

    if (requestMarkAsSolvedButton) {
        requestMarkAsSolvedButton.addEventListener("click", function() {
            requestMarkAsSolvedCheckbox.setAttribute("checked", true);
            requestCommentSubmitButton.disabled = true;
            this.setAttribute("data-disabled", true);
            // Element.closest is not supported in IE11
            closest(this, "form").submit();
        });
    }

    // Change Mark as solved text according to whether comment is filled
    var requestCommentTextarea = document.querySelector(
        ".request-container .comment-container textarea"
    );

    if (requestCommentTextarea) {
        requestCommentTextarea.addEventListener("input", function() {
            if (requestCommentTextarea.value === "") {
                if (requestMarkAsSolvedButton) {
                    requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute(
                        "data-solve-translation"
                    );
                }
                requestCommentSubmitButton.disabled = true;
            } else {
                if (requestMarkAsSolvedButton) {
                    requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute(
                        "data-solve-and-submit-translation"
                    );
                }
                requestCommentSubmitButton.disabled = false;
            }
        });
    }

    // Disable submit button if textarea is empty
    if (requestCommentTextarea && requestCommentTextarea.value === "") {
        requestCommentSubmitButton.disabled = true;
    }

    // Submit requests filter form on status or organization change in the request list page
    Array.prototype.forEach.call(
        document.querySelectorAll(
            "#request-status-select, #request-organization-select"
        ),
        function(el) {
            el.addEventListener("change", function(e) {
                e.stopPropagation();
                saveFocus();
                closest(this, "form").submit();
            });
        }
    );

    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector("#quick-search");
    quickSearch &&
        quickSearch.addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                // Enter key
                e.stopPropagation();
                saveFocus();
                closest(this, "form").submit();
            }
        });

    function toggleNavigation(toggle, menu) {
        var isExpanded = menu.getAttribute("aria-expanded") === "true";
        menu.setAttribute("aria-expanded", !isExpanded);
        toggle.setAttribute("aria-expanded", !isExpanded);
    }

    function closeNavigation(toggle, menu) {
        menu.setAttribute("aria-expanded", false);
        toggle.setAttribute("aria-expanded", false);
        toggle.focus();
    }

    // Toggles expanded aria to collapsible elements
    var collapsible = document.querySelectorAll(
        ".collapsible-nav, .collapsible-sidebar"
    );

    Array.prototype.forEach.call(collapsible, function(el) {
        var toggle = el.querySelector(
            ".collapsible-nav-toggle, .collapsible-sidebar-toggle"
        );

        el.addEventListener("click", function(e) {
            toggleNavigation(toggle, this);
        });

        el.addEventListener("keyup", function(e) {
            if (e.keyCode === 27) {
                // Escape key
                closeNavigation(toggle, this);
            }
        });
    });

    // Submit organization form in the request page
    var requestOrganisationSelect = document.querySelector(
        "#request-organization select"
    );

    if (requestOrganisationSelect) {
        requestOrganisationSelect.addEventListener("change", function() {
            closest(this, "form").submit();
        });
    }

    // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
    var seeAllTrigger = document.querySelector("#see-all-sections-trigger");
    var subsectionsList = document.querySelector(".section-list");

    if (subsectionsList && subsectionsList.children.length > 6) {
        seeAllTrigger.setAttribute("aria-hidden", false);

        seeAllTrigger.addEventListener("click", function(e) {
            subsectionsList.classList.remove("section-list--collapsed");
            seeAllTrigger.parentNode.removeChild(seeAllTrigger);
        });
    }

    // If multibrand search has more than 5 help centers or categories collapse the list
    var multibrandFilterLists = document.querySelectorAll(
        ".multibrand-filter-list"
    );
    Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
        if (filter.children.length > 6) {
            // Display the show more button
            var trigger = filter.querySelector(".see-all-filters");
            trigger.setAttribute("aria-hidden", false);

            // Add event handler for click
            trigger.addEventListener("click", function(e) {
                e.stopPropagation();
                trigger.parentNode.removeChild(trigger);
                filter.classList.remove("multibrand-filter-list--collapsed");
            });
        }
    });

    // If there are any error notifications below an input field, focus that field
    var notificationElm = document.querySelector(".notification-error");
    if (
        notificationElm &&
        notificationElm.previousElementSibling &&
        typeof notificationElm.previousElementSibling.focus === "function"
    ) {
        notificationElm.previousElementSibling.focus();
    }

    // Replaces text within html tag having class "current-year" to the today's
    // date "year" value in the following format: YYYY.
    var currentYear = document.querySelector(".current-year");
    if (currentYear != undefined) {
        currentYear.innerText = new Date().getFullYear();
    }

    // hide contact sections for specific roles
    function setStyleForBlock(selectorString, styleAttribute) {
        Array.prototype.filter
            .call(
                [document.querySelector(selectorString)],
                function processItem(item) {
                    return item;
                }
            )
            .forEach(function processItem(item) {
                item.setAttribute("style", styleAttribute);
            });
    }

    // This is hiding ticket form select field - due to (mis?)configuration and
    // usage of specific form in each instance / brand / language.
    setStyleForBlock(".request_ticket_form_id", "display:none");
});
