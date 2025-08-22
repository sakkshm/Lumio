-- Table to store per-server moderation settings
local servers = {}

-- Default settings if a server has not set up config
local defaultConfig = {
  bannedWords = {},
  strictness = 2  -- 1 = lenient, 2 = normal, 3 = strict, 4 = max strict
}

-- Set or update server config
local function setServerConfig(serverId, bannedWords, strictness)
  servers[serverId] = {
    bannedWords = bannedWords or defaultConfig.bannedWords,
    strictness = strictness or defaultConfig.strictness
  }
end

-- Get config (fall back to default)
local function getServerConfig(serverId)
  return servers[serverId] or defaultConfig
end

-- Check if message contains banned content based on strictness
local function containsBadContent(message, config)
  local msg_lower = message:lower()

  for _, word in ipairs(config.bannedWords) do

    -- strictness levels:

    -- 1: exact match only
    if config.strictness == 1 then
      if msg_lower == word then return word 
    end

    -- 2: substring match
    elseif config.strictness == 2 then
      if string.find(msg_lower, word, 1, true) then return word 
    end

    -- 3: substring match + check split words
    elseif config.strictness == 3 then
      for w in msg_lower:gmatch("%w+") do
        if w == word then return word end
      end
    
    -- 4: very strict, block if word appears anywhere
    elseif config.strictness == 4 then
      if string.find(msg_lower, word) then return word end
    end
  end

  return nil
end

-- Moderate message for a given server
local function moderate(serverId, message)
  local config = getServerConfig(serverId)
  local bw = containsBadContent(message, config)

  if bw then
    return { decision = "block", reason = "Contains banned word: " .. bw }
  else
    return { decision = "allow", reason = "Clean message" }
  end
end

-- Handler to set server config
Handlers.add("set-config", Handlers.utils.hasMatchingTag("Action", "SetConfig"),
  function(msg)
    local serverId = msg.Server or "global"
    local strictness = tonumber(msg.Strictness) or 2
    local bannedWords = msg.BannedWords and msg.BannedWords:split(",") or nil

    setServerConfig(serverId, bannedWords, strictness)

    print("Server added!")

    ao.send({
      Target = msg.From,
      Action = "ConfigSet",
      Data = "Config updated for server: " .. serverId
    })
  end
)

-- Handler to moderate messages
Handlers.add("moderation-check", Handlers.utils.hasMatchingTag("Action", "Moderate"),
  function(msg)
    local serverId = msg.Server or "global"

    print("Message is: " .. msg.Data);

    local result = moderate(serverId, msg.Data)

    ao.send({
      Target = msg.From,
      Action = "ModerationResult",
      Data = result.decision .. " | " .. result.reason
    })
  end
)

-- Utility: string split
function string:split(sep)
  local fields = {}
  local pattern = string.format("([^%s]+)", sep)
  self:gsub(pattern, function(c) fields[#fields+1] = c end)
  return fields
end
