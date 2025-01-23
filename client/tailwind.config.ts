/* Assuming this is part of a larger CSS stylesheet */
.button {
  /* ... other styles ... */
  animation: {
          "gradient-fast": "gradient-fast 3s ease infinite",
          gradient: "gradient 15s ease infinite",
        };
}

@keyframes "gradient-fast" {
  "0%, 100%": { backgroundPosition: "0% 50%" },
  "50%": { backgroundPosition: "100% 50%" },
}

@keyframes gradient {
  /* ... existing gradient animation keyframes ... */
}